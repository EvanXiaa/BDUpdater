#!/usr/bin/env python3
"""Convert a breaking-change list into TAPIR detection patterns.

Deterministic, LLM-free. Reads ``bc_final_list.json`` (agent-authored in
stage 1) and writes ``tapir.json``: a JSON array whose entries are consumable
by TAPIR's ``require(patternFile)`` contract, i.e. each item has a ``pattern``
string and a ``changelogId``.

Usage:
    transform_patterns.py <bc_final_list.json> <library> [--out tapir.json]

``<library>`` is the TAPIR client/import name used inside access-path patterns.
It is not necessarily the npm package's display name or repository name.
"""
import argparse
import json
import logging
import os
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Any, Dict, Iterable, List

logger = logging.getLogger("transform_patterns")
BUILTIN_TAPIR_DIST = Path(__file__).resolve().parents[1] / "static_components"
REQUIRED_BC_FIELDS = {
    "Id",
    "Reference",
    "BC_description",
    "Changed_object",
    "Adaptation_method",
    "RequireInfo",
    "RequireInfoFlag",
}
REQUIRED_CHANGED_OBJECT_FIELDS = {
    "type",
    "className",
    "methodName",
    "propertyName",
    "moduleName",
}
SUPPORTED_BC_TYPES = {"environment", "config", "import", "call", "read", "write"}
JS_IDENTIFIER_RE = re.compile(r"^[$A-Za-z_][$\w]*$")


def validate_bc_contract(bc: Any, index: int) -> Dict[str, Any]:
    if not isinstance(bc, dict):
        raise ValueError(f"BC #{index} must be an object")
    missing = sorted(REQUIRED_BC_FIELDS - set(bc))
    if missing:
        raise ValueError(f"BC #{index} missing fields: {missing}")
    if not isinstance(bc["Reference"], list) or not all(
        isinstance(value, str) for value in bc["Reference"]
    ):
        raise ValueError(f"BC #{index} Reference must be a string array")
    if not isinstance(bc["BC_description"], str) or not bc["BC_description"].strip():
        raise ValueError(f"BC #{index} BC_description must be non-empty")
    if not isinstance(bc["Adaptation_method"], str):
        raise ValueError(f"BC #{index} Adaptation_method must be a string")
    if not isinstance(bc["RequireInfoFlag"], bool):
        raise ValueError(f"BC #{index} RequireInfoFlag must be boolean")
    if not isinstance(bc["RequireInfo"], str):
        raise ValueError(f"BC #{index} RequireInfo must be a string")
    if bc["RequireInfoFlag"] and not bc["RequireInfo"].strip():
        raise ValueError(
            f"BC #{index} RequireInfo must explain an unresolved RequireInfoFlag"
        )
    if not bc["RequireInfoFlag"] and bc["RequireInfo"].strip():
        raise ValueError(
            f"BC #{index} RequireInfo must be empty when RequireInfoFlag is false"
        )

    changed = bc["Changed_object"]
    if not isinstance(changed, dict):
        raise ValueError(f"BC #{index} Changed_object must be an object")
    missing_changed = sorted(REQUIRED_CHANGED_OBJECT_FIELDS - set(changed))
    if missing_changed:
        raise ValueError(
            f"BC #{index} Changed_object missing fields: {missing_changed}"
        )
    if changed["type"] not in SUPPORTED_BC_TYPES:
        raise ValueError(
            f"BC #{index} has unsupported Changed_object.type={changed['type']!r}"
        )
    for field in ("className", "methodName", "propertyName", "moduleName"):
        values = changed[field]
        if not isinstance(values, list) or not all(
            isinstance(value, str) and value for value in values
        ):
            raise ValueError(
                f"BC #{index} Changed_object.{field} must be a non-empty-string array"
            )
    if changed.get("argFilters") is not None and changed["type"] != "call":
        raise ValueError(f"BC #{index} argFilters is only valid for call BCs")
    return bc


def _coerce_changelog_id(raw: Any) -> Any:
    """Normalize a BC Id to an int when possible.

    Stage 2 parses TAPIR's ``Detection pattern (\\d+)`` output as an int and
    looks the BC up by that number, so a non-integer Id would misalign. Coerce
    numeric strings; return the original value (with a warning) otherwise so the
    caller can decide whether to skip.
    """
    if isinstance(raw, bool):  # bool is an int subclass; treat as invalid id
        return None
    if isinstance(raw, int) and raw >= 0:
        return raw
    if isinstance(raw, str):
        s = raw.strip()
        if s.isdigit():
            return int(s)
    return None


def _brace_join(values: Iterable[str]) -> str:
    """Join non-empty values into a comma-separated ``{a,b,c}`` block."""
    vals = [v for v in values if v]
    if not vals:
        raise ValueError("Cannot build an empty TAPIR member disjunction")
    return "{" + ",".join(vals) + "}"


def _lib_origin(library: str) -> str:
    """The import-origin disjunction ``{<lib>,<lib/**/*>}`` shared by patterns."""
    return "{" + f"<{library}>" + "," + f"<{library}/**/*>" + "}"


def _normalize_module_name(module_name: str, library: str) -> str:
    value = module_name.strip()
    if not value:
        raise ValueError("moduleName cannot contain blank values")
    if value == "*":
        return value
    if value == library or value.startswith(library + "/"):
        normalized = value
    else:
        normalized = f"{library}/{value.lstrip('./')}"
    return normalized.removesuffix(".js")


def _module_props_block(mods: Iterable[str], library: str) -> str:
    """Import target: wildcard to the library+subpaths, or explicit modules."""
    mods = list(mods or [])
    if not mods:
        raise ValueError("import/config BC requires at least one moduleName")
    if mods == ["*"]:
        return "{" + f"{library}/**/*," + f"{library}" + "}"
    if "*" in mods:
        raise ValueError("moduleName '*' must appear alone")
    cleaned = [_normalize_module_name(module, library) for module in mods]
    return "{" + ",".join(cleaned) + "}"


def _origin_for_module(module_name: str | None, library: str) -> str:
    if not module_name or module_name == "*":
        return _lib_origin(library)
    return f"<{_normalize_module_name(module_name, library)}>"


def _target_access_path(target: Dict[str, Any], library: str) -> str:
    """Render one structured target without losing module/class/export scope."""
    if "exportStyle" not in target or "uncertain" not in target:
        raise ValueError(
            "Each structured target must explicitly set exportStyle and uncertain"
        )
    export_style = target["exportStyle"]
    origin = _origin_for_module(target.get("moduleName"), library)
    class_name = target.get("className")
    member_name = target.get("memberName")
    uncertain = target["uncertain"]
    if not isinstance(uncertain, bool):
        raise ValueError("target.uncertain must be boolean")
    for field, value in (
        ("moduleName", target.get("moduleName")),
        ("className", class_name),
        ("memberName", member_name),
    ):
        if value is not None and (not isinstance(value, str) or not value):
            raise ValueError(
                f"target.{field} must be a non-empty string or null"
            )
        if value == "*":
            raise ValueError(
                f"target.{field} wildcard is unsupported; enumerate explicit targets"
            )
        if (
            field in ("className", "memberName")
            and value is not None
            and not JS_IDENTIFIER_RE.fullmatch(value)
        ):
            raise ValueError(
                f"target.{field} must be an exact JavaScript identifier, got {value!r}"
            )
    if export_style != "instance" and not target.get("moduleName"):
        raise ValueError(
            f"exportStyle={export_style!r} requires an explicit moduleName"
        )

    if export_style in ("direct", "default"):
        path = origin
    elif export_style == "deep-module":
        if not target.get("moduleName"):
            raise ValueError("deep-module target requires moduleName")
        path = origin
    elif export_style == "instance":
        path = origin + ("?**" if uncertain else "**")
    elif export_style in ("named", "member"):
        path = origin + ("?**" if uncertain else "")
        if class_name and class_name != "*":
            path += f".{class_name}"
    else:
        raise ValueError(f"Unsupported exportStyle={export_style!r}")

    if member_name:
        if member_name == "*":
            raise ValueError("Wildcard memberName is not supported by TAPIR")
        path += f".{member_name}"
    return path


def _legacy_targets(pre: Dict[str, Any], ptype: str) -> List[Dict[str, Any]]:
    """Convert legacy parallel arrays to scoped targets without flattening names."""
    modules = list(pre.get("moduleName") or [])
    classes = list(pre.get("className") or [])
    method_names = list(pre.get("methodName") or [])
    property_names = list(pre.get("propertyName") or [])
    names = method_names if ptype == "call" else property_names
    concrete_modules = [name for name in modules if name and name != "*"]
    if len(concrete_modules) > 1:
        raise ValueError(
            "Legacy locatable BC with multiple moduleName values is ambiguous; "
            "use Changed_object.targets[]"
        )
    module_name = concrete_modules[0] if concrete_modules else None
    concrete_classes = [name for name in classes if name and name != "*"]
    constructor_names = {
        "constructor",
        *{f"{class_name}.constructor" for class_name in concrete_classes},
    }
    if concrete_classes and names and not all(
        name in constructor_names for name in names
    ):
        raise ValueError(
            "Legacy className plus method/property names is ambiguous between "
            "instance and exported/static access; use Changed_object.targets[] "
            "with exportStyle='instance' or 'member'"
        )

    targets: List[Dict[str, Any]] = []
    for name in names:
        if not name or name == "*":
            raise ValueError(
                f"{ptype} wildcard/blank members are not supported; use explicit targets"
            )
        segments = name.split(".")
        if ptype == "call" and segments[-1] == "constructor":
            constructor_class = (
                segments[-2] if len(segments) >= 2 else
                concrete_classes[0] if len(concrete_classes) == 1 else None
            )
            if not constructor_class:
                raise ValueError(
                    "constructor target requires a className or structured targets[]"
                )
            targets.append({
                "moduleName": module_name,
                "className": constructor_class,
                "memberName": None,
                "exportStyle": "member",
                "uncertain": True,
            })
            continue

        qualified_class = segments[-2] if len(segments) >= 2 else None
        if qualified_class:
            raise ValueError(
                f"Qualified legacy target {name!r} is ambiguous; use targets[]"
            )
        member_name = segments[-1]
        targets.append({
            "moduleName": module_name,
            "className": None,
            "memberName": member_name,
            "exportStyle": "instance",
            "uncertain": True,
        })
    return targets


# TAPIR call-filter types accepted by the dist matcher (pattern-language.js).
# Note: literals (quoted strings, numbers, true/false/undefined/NaN) are also
# valid as a "type" — anything not in this set is treated as a literal value.
_FILTER_TYPES = {
    "string", "number", "boolean", "undefined",
    "function", "function1", "function2", "function3", "object", "array",
}


def _build_filters(arg_filters: Dict[str, Any]) -> str:
    """Render Changed_object.argFilters into a TAPIR filter suffix string.

    Emits ``[minArgs,maxArgs]`` (both required — open ranges ``[n,]`` are NOT
    supported by the dist parser, so callers encode "at least n" as a large
    maxArgs) followed by ``index:{types}`` type filters. Returns "" when there
    is nothing to emit. Raises ValueError on malformed input so a bad filter
    fails loudly rather than silently narrowing matches (false negatives).
    """
    if not isinstance(arg_filters, dict):
        raise ValueError("argFilters must be an object")

    parts: List[str] = []
    mn = arg_filters.get("minArgs")
    mx = arg_filters.get("maxArgs")
    if mn is not None or mx is not None:
        if mn is None or mx is None:
            raise ValueError("argFilters needs both minArgs and maxArgs (use a large maxArgs for 'at least n')")
        if not (isinstance(mn, int) and isinstance(mx, int)) or mn < 0 or mx < mn:
            raise ValueError(f"invalid arity range [{mn},{mx}]")
        parts.append(f"[{mn},{mx}]")

    raw_specs = arg_filters.get("argTypes", []) or []
    if not isinstance(raw_specs, list):
        raise ValueError("argTypes must be an array")
    merged_types: Dict[int, List[str]] = {}
    for spec in raw_specs:
        if not isinstance(spec, dict):
            raise ValueError("Each argTypes entry must be an object")
        idx = spec.get("index")
        raw_types = spec.get("types") or []
        if not isinstance(raw_types, list):
            raise ValueError(f"argTypes[index={idx}] types must be an array")
        types = [t for t in raw_types if t]
        if not isinstance(idx, int) or idx < 0:
            raise ValueError(f"argTypes.index must be a non-negative int, got {idx!r}")
        if not types:
            raise ValueError(f"argTypes[index={idx}] has no types")
        # Validate: each entry is a known type or a literal (quoted/num/bool/etc.)
        for t in types:
            if not isinstance(t, str):
                raise ValueError(f"argTypes[index={idx}] values must be strings")
            if t in _FILTER_TYPES:
                continue
            if (t.startswith("'") and t.endswith("'")) or (t.startswith('"') and t.endswith('"')):
                literal_body = t[1:-1]
                if (
                    any(character.isspace() for character in t)
                    or "," in literal_body
                    or "\\" in literal_body
                    or "'" in literal_body
                    or '"' in literal_body
                ):
                    raise ValueError(
                        "TAPIR quoted literals containing whitespace, commas, "
                        "backslashes, or nested quotes are unsupported"
                    )
                continue
            if t in ("true", "false", "undefined", "NaN"):
                continue
            try:
                int(t)
                continue
            except ValueError:
                raise ValueError(
                    f"argTypes[index={idx}] type {t!r} is not a valid TAPIR type or literal; "
                    f"valid types: {sorted(_FILTER_TYPES)} or a quoted string / number / true / false"
                )
        bucket = merged_types.setdefault(idx, [])
        for value in types:
            if value not in bucket:
                bucket.append(value)

    if merged_types and (mn is None or mx is None):
        raise ValueError("argTypes requires explicit minArgs and maxArgs")
    if merged_types and mn < max(merged_types) + 1:
        raise ValueError(
            "minArgs must be greater than the highest argTypes index"
        )
    for idx in sorted(merged_types):
        types = merged_types[idx]
        body = types[0] if len(types) == 1 else "{" + ",".join(types) + "}"
        parts.append(f"{idx}:{body}")

    return " ".join(parts)


def _patterns_for_target(
    ptype: str,
    target: Dict[str, Any],
    filter_suffix: str,
    changelog_id: int,
    library: str,
) -> List[Dict[str, Any]]:
    path = _target_access_path(target, library)
    patterns: List[Dict[str, Any]] = []
    if ptype == "call":
        call_pattern = " ".join(["call", path, filter_suffix]).strip()
        call_entry = {
            "type": "call",
            "pattern": call_pattern,
            "changelogId": changelog_id,
        }
        if target.get("exportStyle") == "named":
            call_entry["requiresSupplemental"] = True
        patterns.append(call_entry)
        if not filter_suffix and target.get("memberName"):
            read_entry = {
                "type": "call",
                "pattern": f"read {path}",
                "changelogId": changelog_id,
            }
            if target.get("exportStyle") == "named":
                read_entry["requiresSupplemental"] = True
            patterns.append(read_entry)
    elif ptype in ("read", "write"):
        if not target.get("memberName"):
            raise ValueError(f"{ptype} target requires memberName")
        entry = {
            "type": ptype,
            "pattern": f"{ptype} {path}",
            "changelogId": changelog_id,
        }
        if target.get("exportStyle") == "named":
            entry["requiresSupplemental"] = True
        patterns.append(entry)
    return patterns


def validate_patterns_with_tapir(patterns: List[Dict[str, Any]], tapir_dist: Path) -> None:
    parser_path = tapir_dist / "pattern-finder" / "pattern-language.js"
    if not parser_path.exists():
        raise ValueError(f"TAPIR pattern parser not found: {parser_path}")
    script = (
        "const fs=require('fs');"
        "const parser=require(process.argv[1]);"
        "const patterns=JSON.parse(fs.readFileSync(0,'utf8'));"
        "for(const item of patterns){parser.parsePattern(item.pattern);}"
    )
    proc = subprocess.run(
        ["node", "-e", script, str(parser_path)],
        input=json.dumps(patterns),
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        timeout=30,
    )
    if proc.returncode != 0:
        raise ValueError(
            "Generated TAPIR pattern failed parser validation: "
            + (proc.stderr or proc.stdout).strip()
        )


def transform_patterns(bc_list: Dict[str, Any], library: str) -> List[Dict[str, Any]]:
    """Convert a parsed bc_final_list dict into a list of TAPIR pattern dicts."""
    bcs = bc_list.get("breaking_changes", [])
    if not isinstance(bcs, list):
        raise ValueError("'breaking_changes' must be a list")

    out_patterns: List[Dict[str, Any]] = []
    seen_ids = set()

    for index, raw_bc in enumerate(bcs):
        bc = validate_bc_contract(raw_bc, index)
        pre = dict(bc.get("Changed_object") or {})
        ptype = pre.get("type")

        bc_id = _coerce_changelog_id(bc["Id"])
        if bc_id is None:
            raise ValueError(f"BC Id must be a non-negative integer: {bc['Id']!r}")
        if bc_id in seen_ids:
            raise ValueError(f"Duplicate BC Id: {bc_id}")
        seen_ids.add(bc_id)

        if ptype in ("call", "read", "write"):
            raw_targets = pre.get("targets")
            if raw_targets is not None:
                if not isinstance(raw_targets, list) or not raw_targets:
                    raise ValueError(f"Id={bc_id}: targets must be a non-empty array")
                targets = raw_targets
            else:
                targets = _legacy_targets(pre, ptype)
            if not targets:
                raise ValueError(f"Id={bc_id}: no locatable targets")
            filter_suffix = (
                _build_filters(pre["argFilters"]) if pre.get("argFilters") else ""
            )
            if filter_suffix and ptype != "call":
                raise ValueError(f"Id={bc_id}: argFilters is only valid for call BCs")
            for target in targets:
                if not isinstance(target, dict):
                    raise ValueError(f"Id={bc_id}: each target must be an object")
                out_patterns.extend(
                    _patterns_for_target(
                        ptype,
                        target,
                        filter_suffix,
                        bc_id,
                        library,
                    )
                )

        elif ptype == "import":
            import_block = _module_props_block(pre.get("moduleName", []), library)
            out_patterns.append({
                "type": "import",
                "pattern": " ".join(["import", import_block]),
                "changelogId": bc_id,
            })
        else:
            # environment / config / unknown: not locatable by TAPIR access paths
            logger.info("Skipping non-locatable type '%s' (Id=%s)", ptype, bc_id)
            continue

    if not out_patterns:
        raise ValueError("No TAPIR-locatable patterns were generated")
    unique_patterns = []
    index_by_key = {}
    for pattern in out_patterns:
        key = (pattern["changelogId"], pattern["pattern"])
        if key not in index_by_key:
            index_by_key[key] = len(unique_patterns)
            unique_patterns.append(pattern)
        elif pattern.get("requiresSupplemental") is True:
            unique_patterns[index_by_key[key]]["requiresSupplemental"] = True
    out_patterns = unique_patterns
    out_patterns.sort(key=lambda pattern: (pattern["type"] == "import", pattern["changelogId"]))
    return out_patterns


def main() -> None:
    ap = argparse.ArgumentParser(description="Transform bc_final_list.json into TAPIR patterns.")
    ap.add_argument("bc_list", help="Path to bc_final_list.json")
    ap.add_argument("library", help="TAPIR client/import name used in patterns")
    ap.add_argument(
        "--tapir-dist",
        default=None,
        help="Path to TAPIR dist (or set $TAPIR_DIST); used to validate every pattern",
    )
    ap.add_argument("--out", default=None, help="Output path (default: tapir.json next to input)")
    args = ap.parse_args()

    in_path = Path(args.bc_list)
    if not in_path.exists():
        raise SystemExit(f"Missing input: {in_path}")
    out_path = Path(args.out) if args.out else in_path.parent / "tapir.json"

    tapir_dist_value = args.tapir_dist or os.environ.get("TAPIR_DIST")
    tapir_dist = (
        Path(tapir_dist_value) if tapir_dist_value else BUILTIN_TAPIR_DIST
    )

    try:
        bc_list = json.loads(in_path.read_text(encoding="utf-8"))
        patterns = transform_patterns(bc_list, args.library)
        validate_patterns_with_tapir(patterns, tapir_dist)
    except (json.JSONDecodeError, ValueError, subprocess.TimeoutExpired) as exc:
        raise SystemExit(f"Pattern generation failed: {exc}") from exc

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        dir=out_path.parent,
        prefix=f".{out_path.name}.",
        delete=False,
    ) as handle:
        json.dump(patterns, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temp_name = handle.name
    os.replace(temp_name, out_path)
    print(f"Wrote {len(patterns)} patterns to {out_path}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s | %(message)s")
    main()
