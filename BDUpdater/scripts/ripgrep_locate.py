#!/usr/bin/env python3
"""Generate supplemental low-confidence candidates with ripgrep.

Deterministic, LLM-free. Compiles the *name-type* and *import-type* TAPIR
patterns it can safely approximate into ripgrep regexes and reports matches in
the same location shape as tapir_locate.py:
    [{"pattern_id": <changelogId>, "file": "...", "line": N,
      "column": N, "confidence": "low"}, ...]

Run TAPIR first. This script cannot prove receiver provenance or call semantics,
so every match is "low" confidence and supplemental only.

It rejects argument/type/arity filters instead of silently ignoring them.

Usage:
    ripgrep_locate.py <target_dir> <pattern_file> \
        [--exclude-folders node_modules,packages] [--globs '*.js,*.mjs,*.cjs'] \
        [--out locations.json]
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_GLOBS = "*.js,*.mjs,*.cjs,*.es,*.jsx,*.ts,*.tsx,*.mts,*.cts"
DEFAULT_TIMEOUT_SECONDS = 60

# member set is the final `.{...}` in read/write/call patterns
_MEMBERS_RE = re.compile(r"\.\{([^}]*)\}\s*(?:\[|[0-9]+:|$)")
# single final member such as `.run`
_SINGLE_MEMBER_RE = re.compile(
    r"\.([A-Za-z_$][\w$]*)\s*(?:\[\s*\d+\s*,|\d+\s*:|$)"
)
# import module set is the first `{...}`
_MODSET_RE = re.compile(r"\{([^}]*)\}")
# arg/type filters that ripgrep cannot express
_FILTER_RE = re.compile(
    r"\[\s*\d+\s*,\s*\d+\s*\]"
    r"|\b\d+\s*:\s*(?:\{[^}]+\}|[^\s]+)"
)


def _mod_glob_to_regex(spec: str) -> str:
    out: List[str] = []
    i = 0
    while i < len(spec):
        if spec[i:i + 3] == "**/":
            out.append(r"(?:[^'\"]*/)?"); i += 3
        elif spec[i:i + 2] == "**":
            out.append(r"[^'\"]*"); i += 2
        elif spec[i] == "*":
            out.append(r"[^'\"/]*"); i += 1
        else:
            out.append(re.escape(spec[i])); i += 1
    return "".join(out)


def compile_pattern(pat: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Return a ripgrep regex, or None if the access form is unsupported."""
    s = str(pat.get("pattern", "")).strip()
    if not s:
        return None
    kind = s.split(None, 1)[0]
    if _FILTER_RE.search(s):
        raise ValueError(
            f"ripgrep cannot enforce TAPIR call filters: {s}"
        )

    if kind == "import":
        m = _MODSET_RE.search(s)
        if not m:
            return None
        specs = [x.strip() for x in m.group(1).split(",") if x.strip()]
        alts = "|".join(_mod_glob_to_regex(x) for x in specs)
        # require('mod'), import ... from 'mod', import 'mod'
        regex = (
            r"""(?:require\(\s*['"]|import\(\s*['"]|from\s+['"]|import\s+['"])"""
            r"(?:" + alts + r""")['"]"""
        )
        return {"regex": regex}

    if kind in ("read", "write", "call"):
        m = _MEMBERS_RE.search(s)
        if m:
            members = [x.strip() for x in m.group(1).split(",") if x.strip()]
        else:
            single = _SINGLE_MEMBER_RE.search(s)
            if not single:
                return None
            members = [single.group(1)]
        members = [x for x in members if x and x != "*"]
        if not members:
            # pure wildcard member set: matching `.\w+` is useless noise
            return None
        alts = "|".join(re.escape(x) for x in members)
        # Supplemental candidate forms:
        #   obj.member / obj["member"]
        #   import {member as alias} / const {member: alias} = require(...)
        boundary = r"(?![$\w])"
        regex = (
            r"(?:\.(?:" + alts + r")" + boundary
            + r"|\[\s*['\"](?:" + alts + r")['\"]\s*\]"
            + r"|[{,]\s*(?:" + alts + r")" + boundary
            + r"(?:\s+as\s+[$\w]+|\s*:\s*[$\w]+)?)"
        )
        return {"regex": regex}

    return None


def _rg_globs(globs: str, exclude_folders: str) -> List[str]:
    args: List[str] = []
    for g in globs.split(","):
        g = g.strip()
        if g:
            args += ["-g", g]
    for f in exclude_folders.split(","):
        f = f.strip()
        if f:
            args += ["-g", f"!{f}/**", "-g", f"!**/{f}/**"]
    return args


def run_rg(
    regex: str,
    target: Path,
    globs: str,
    exclude_folders: str,
    timeout_seconds: int,
) -> List[Dict[str, Any]]:
    cmd = [
        "rg",
        "--json",
        "--pcre2",
        "--hidden",
        "--no-ignore",
        "-e",
        regex,
    ] + _rg_globs(globs, exclude_folders) + [str(target)]
    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            timeout=timeout_seconds,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(
            f"ripgrep timed out after {timeout_seconds}s"
        ) from exc
    # ripgrep uses 1 for "no matches"; any other non-zero code is a failure.
    if proc.returncode not in (0, 1):
        raise RuntimeError(
            f"ripgrep failed with exit code {proc.returncode}: "
            f"{(proc.stderr or '').strip()}"
        )
    hits: List[Dict[str, Any]] = []
    for line in (proc.stdout or "").splitlines():
        try:
            ev = json.loads(line)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"Invalid ripgrep JSON event: {line}") from exc
        if ev.get("type") != "match":
            continue
        d = ev["data"]
        abspath = d["path"]["text"]
        rel = os.path.relpath(abspath, target)
        line_no = d["line_number"]
        for sm in d.get("submatches", []):
            hits.append({
                "file": rel.replace("\\", "/"),
                "line": line_no,
                # rg JSON submatch offsets are zero-based UTF-8 byte offsets.
                "column": sm["start"],
            })
    return hits


def validate_patterns(patterns: Any) -> List[Dict[str, Any]]:
    if not isinstance(patterns, list) or not patterns:
        raise ValueError("Pattern file must be a non-empty JSON array")
    validated: List[Dict[str, Any]] = []
    for index, pattern in enumerate(patterns):
        if not isinstance(pattern, dict):
            raise ValueError(f"Pattern #{index} must be an object")
        if not isinstance(pattern.get("pattern"), str) or not pattern["pattern"].strip():
            raise ValueError(f"Pattern #{index} has no non-empty 'pattern'")
        changelog_id = pattern.get("changelogId")
        if isinstance(changelog_id, bool) or not isinstance(changelog_id, int) or changelog_id < 0:
            raise ValueError(
                f"Pattern #{index} has invalid non-negative integer changelogId"
            )
        validated.append(pattern)
    return validated


def write_json_atomic(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w",
        encoding="utf-8",
        dir=path.parent,
        prefix=f".{path.name}.",
        delete=False,
    ) as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temp_name = handle.name
    os.replace(temp_name, path)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    ap = argparse.ArgumentParser(description="Locate BC-affected usages with ripgrep (TAPIR-compatible output).")
    ap.add_argument("target_dir")
    ap.add_argument("pattern_file", help="TAPIR pattern file (tapir.json / tapirN.json)")
    ap.add_argument("--exclude-folders", default="node_modules,packages")
    ap.add_argument("--globs", default=DEFAULT_GLOBS)
    ap.add_argument(
        "--allow-partial",
        action="store_true",
        help=(
            "After a successful TAPIR baseline, skip unsupported patterns and "
            "emit supplemental candidates for the supported subset"
        ),
    )
    ap.add_argument(
        "--timeout-seconds",
        type=int,
        default=DEFAULT_TIMEOUT_SECONDS,
        help=f"ripgrep timeout (default: {DEFAULT_TIMEOUT_SECONDS})",
    )
    ap.add_argument(
        "--run-report",
        help="Write a supplemental ripgrep run report; requires --out",
    )
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    target = Path(args.target_dir)
    if not target.is_dir():
        raise SystemExit(f"Target dir not found: {target}")
    pattern_path = Path(args.pattern_file)
    if not pattern_path.exists():
        raise SystemExit(f"Pattern file not found: {pattern_path}")
    try:
        patterns = validate_patterns(
            json.loads(pattern_path.read_text(encoding="utf-8"))
        )
    except (json.JSONDecodeError, ValueError) as exc:
        raise SystemExit(f"Invalid pattern file {pattern_path}: {exc}") from exc

    if subprocess.run(
        ["sh", "-c", "command -v rg >/dev/null 2>&1"],
        check=False,
    ).returncode != 0:
        raise SystemExit("ripgrep (rg) is required for supplemental locating")

    results: List[Dict[str, Any]] = []
    unsupported: List[str] = []
    attempted_ids = set()
    for pat in patterns:
        pid = pat.get("changelogId")
        try:
            compiled = compile_pattern(pat)
        except ValueError as exc:
            if args.allow_partial:
                unsupported.append(f"changelogId={pid}: {exc}")
                continue
            raise SystemExit(str(exc)) from exc
        if compiled is None:
            unsupported.append(
                f"changelogId={pid}: {pat.get('pattern')}"
            )
            continue
        attempted_ids.add(pid)
        try:
            hits = run_rg(
                compiled["regex"],
                target,
                args.globs,
                args.exclude_folders,
                args.timeout_seconds,
            )
        except RuntimeError as exc:
            raise SystemExit(str(exc)) from exc
        for hit in hits:
            results.append({
                "pattern_id": pid,
                "file": hit["file"],
                "line": hit["line"],
                "column": hit["column"],
                "confidence": "low",  # ripgrep cannot prove provenance
                "backend": "ripgrep",
                "filter_applied": False,
            })
    if unsupported:
        if not args.allow_partial:
            raise SystemExit(
                "ripgrep cannot express all patterns; TAPIR baseline is required:\n"
                + "\n".join(unsupported)
            )
        print(
            "ripgrep supplemental scan skipped unsupported patterns:\n"
            + "\n".join(unsupported),
            file=sys.stderr,
        )

    # Collapse duplicate hits at the same (pattern_id, file, line, column):
    # overlapping member sets across patterns can report a location twice.
    seen = set()
    deduped: List[Dict[str, Any]] = []
    for r in results:
        key = (r["pattern_id"], r["file"], r["line"], r["column"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)
    results = deduped

    payload = json.dumps(results, ensure_ascii=False, indent=2)
    if args.out:
        output_path = Path(args.out)
        write_json_atomic(output_path, results)
        if args.run_report:
            write_json_atomic(Path(args.run_report), {
                "schema_version": "1",
                "status": "passed",
                "backend": "ripgrep",
                "target_dir": str(target.resolve()),
                "pattern_file": str(pattern_path.resolve()),
                "pattern_file_sha256": sha256(pattern_path),
                "locations_file": str(output_path.resolve()),
                "locations_file_sha256": sha256(output_path),
                "location_count": len(results),
                "attempted_bc_ids": sorted(attempted_ids),
                "skipped_patterns": unsupported,
                "complete": not unsupported,
            })
        print(f"Wrote {len(results)} locations to {args.out}")
    else:
        if args.run_report:
            raise SystemExit("--run-report requires --out")
        print(payload)


if __name__ == "__main__":
    main()
