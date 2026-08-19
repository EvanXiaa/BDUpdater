#!/usr/bin/env python3
"""Create and validate the Stage-1 -> Stage-2 handoff contract."""
import argparse
import hashlib
import json
import os
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Any, Dict, List

LOCATABLE_TYPES = {"call", "read", "write", "import"}
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
HANDOFF_FIELDS = {
    "schema_version",
    "package_name",
    "upstream_repo",
    "old_version",
    "new_version",
    "old_commit",
    "new_commit",
    "tapir_client_name",
    "bc_list",
    "pattern_file",
    "precision_reviewed",
    "bc_list_sha256",
    "pattern_file_sha256",
}
REPO_RE = re.compile(r"^[^/\s]+/[^/\s]+$")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


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


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def validate_bc_list(value: Any) -> Dict[int, Dict[str, Any]]:
    if not isinstance(value, dict) or not isinstance(value.get("breaking_changes"), list):
        raise ValueError("bc_final_list.json must be {'breaking_changes': [...]}")
    by_id: Dict[int, Dict[str, Any]] = {}
    for index, bc in enumerate(value["breaking_changes"]):
        if not isinstance(bc, dict):
            raise ValueError(f"BC #{index} must be an object")
        missing = sorted(REQUIRED_BC_FIELDS - set(bc))
        if missing:
            raise ValueError(f"BC #{index} missing fields: {missing}")
        bc_id = bc.get("Id")
        if isinstance(bc_id, bool) or not isinstance(bc_id, int) or bc_id < 0:
            raise ValueError(f"BC #{index} has invalid non-negative integer Id")
        if bc_id in by_id:
            raise ValueError(f"Duplicate BC Id: {bc_id}")
        if not isinstance(bc.get("Changed_object"), dict):
            raise ValueError(f"BC Id={bc_id} has no Changed_object")
        if not isinstance(bc.get("RequireInfoFlag"), bool):
            raise ValueError(f"BC Id={bc_id} RequireInfoFlag must be boolean")
        if not isinstance(bc.get("RequireInfo"), str):
            raise ValueError(f"BC Id={bc_id} RequireInfo must be a string")
        if bc["RequireInfoFlag"] and not bc["RequireInfo"].strip():
            raise ValueError(
                f"BC Id={bc_id} unresolved flag requires a RequireInfo explanation"
            )
        by_id[bc_id] = bc
    return by_id


def validate_patterns(value: Any, bc_by_id: Dict[int, Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not isinstance(value, list) or not value:
        raise ValueError("Pattern file must be a non-empty JSON array")
    patterns: List[Dict[str, Any]] = []
    covered = set()
    for index, pattern in enumerate(value):
        if not isinstance(pattern, dict):
            raise ValueError(f"Pattern #{index} must be an object")
        if not isinstance(pattern.get("pattern"), str) or not pattern["pattern"].strip():
            raise ValueError(f"Pattern #{index} has no non-empty pattern")
        changelog_id = pattern.get("changelogId")
        if changelog_id not in bc_by_id:
            raise ValueError(
                f"Pattern #{index} references unknown changelogId={changelog_id!r}"
            )
        covered.add(changelog_id)
        patterns.append(pattern)
    missing = [
        bc_id
        for bc_id, bc in bc_by_id.items()
        if bc["Changed_object"].get("type") in LOCATABLE_TYPES
        and bc_id not in covered
    ]
    if missing:
        raise ValueError(f"Locatable BCs have no TAPIR patterns: {missing}")
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
            "TAPIR rejected a generated pattern: "
            + (proc.stderr or proc.stdout).strip()
        )


def resolve_artifact(handoff_path: Path, artifact: str) -> Path:
    path = Path(artifact)
    return path if path.is_absolute() else handoff_path.parent / path


def validate_handoff_metadata(value: Any) -> Dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError("handoff.json must be a JSON object")
    missing = sorted(HANDOFF_FIELDS - set(value))
    extra = sorted(set(value) - HANDOFF_FIELDS)
    if missing:
        raise ValueError(f"handoff.json missing fields: {missing}")
    if extra:
        raise ValueError(f"handoff.json has unsupported fields: {extra}")
    if value["schema_version"] != "1":
        raise ValueError(
            f"Unsupported handoff schema_version={value['schema_version']!r}"
        )
    for field in (
        "package_name",
        "old_version",
        "new_version",
        "tapir_client_name",
        "bc_list",
        "pattern_file",
    ):
        if not isinstance(value[field], str) or not value[field].strip():
            raise ValueError(f"handoff.{field} must be a non-empty string")
    if not isinstance(value["upstream_repo"], str) or not REPO_RE.fullmatch(
        value["upstream_repo"]
    ):
        raise ValueError("upstream_repo must be exactly owner/repo")
    for field in ("old_commit", "new_commit"):
        if value[field] is not None and (
            not isinstance(value[field], str) or not value[field].strip()
        ):
            raise ValueError(f"handoff.{field} must be null or non-empty")
    if value["precision_reviewed"] is not True:
        raise ValueError(
            "handoff precision_reviewed must be true before Stage 2"
        )
    for field in ("bc_list_sha256", "pattern_file_sha256"):
        if not isinstance(value[field], str) or not re.fullmatch(
            r"[a-f0-9]{64}", value[field]
        ):
            raise ValueError(f"handoff.{field} must be a SHA-256 hex digest")
    return value


def validate_handoff(handoff_path: Path, tapir_dist: Path) -> Dict[str, Any]:
    value = validate_handoff_metadata(load_json(handoff_path))

    bc_path = resolve_artifact(handoff_path, value["bc_list"])
    pattern_path = resolve_artifact(handoff_path, value["pattern_file"])
    if not bc_path.is_file() or not pattern_path.is_file():
        raise ValueError("handoff artifacts do not exist")
    if sha256(bc_path) != value["bc_list_sha256"]:
        raise ValueError("bc_final_list.json hash does not match handoff.json")
    if sha256(pattern_path) != value["pattern_file_sha256"]:
        raise ValueError("pattern file hash does not match handoff.json")

    bc_by_id = validate_bc_list(load_json(bc_path))
    patterns = validate_patterns(load_json(pattern_path), bc_by_id)
    validate_patterns_with_tapir(patterns, tapir_dist)
    supplemental_ids = sorted({
        pattern["changelogId"]
        for pattern in patterns
        if pattern.get("requiresSupplemental") is True
    })
    return {
        "package_name": value["package_name"],
        "new_version": value["new_version"],
        "bc_count": len(bc_by_id),
        "pattern_count": len(patterns),
        "precision_reviewed": bool(value.get("precision_reviewed", False)),
        "supplemental_required": bool(supplemental_ids),
        "supplemental_bc_ids": supplemental_ids,
        "handoff_sha256": sha256(handoff_path),
        "bc_list_sha256": value["bc_list_sha256"],
        "pattern_file_sha256": value["pattern_file_sha256"],
        "bc_list": str(bc_path),
        "pattern_file": str(pattern_path),
    }


def create_handoff(args: argparse.Namespace) -> None:
    output = Path(args.out).resolve()
    bc_path = Path(args.bc_list).resolve()
    pattern_path = Path(args.pattern_file).resolve()
    if not bc_path.is_file() or not pattern_path.is_file():
        raise SystemExit("bc-list and pattern-file must exist")
    value = {
        "schema_version": "1",
        "package_name": args.package_name,
        "upstream_repo": args.upstream_repo,
        "old_version": args.old_version,
        "new_version": args.new_version,
        "old_commit": args.old_commit,
        "new_commit": args.new_commit,
        "tapir_client_name": args.tapir_client_name,
        "bc_list": os.path.relpath(bc_path, output.parent),
        "pattern_file": os.path.relpath(pattern_path, output.parent),
        "precision_reviewed": args.precision_reviewed,
        "bc_list_sha256": sha256(bc_path),
        "pattern_file_sha256": sha256(pattern_path),
    }
    try:
        validate_handoff_metadata(value)
    except ValueError as exc:
        raise SystemExit(f"Invalid handoff metadata: {exc}") from exc
    write_json_atomic(output, value)
    print(f"Wrote handoff contract to {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    create = subparsers.add_parser("create")
    create.add_argument("--package-name", required=True)
    create.add_argument("--upstream-repo", required=True, help="owner/repo")
    create.add_argument("--old-version", required=True)
    create.add_argument("--new-version", required=True)
    create.add_argument("--old-commit")
    create.add_argument("--new-commit")
    create.add_argument("--tapir-client-name", required=True)
    create.add_argument("--bc-list", required=True)
    create.add_argument("--pattern-file", required=True)
    create.add_argument("--precision-reviewed", action="store_true")
    create.add_argument("--out", required=True)

    validate = subparsers.add_parser("validate")
    validate.add_argument("handoff")
    validate.add_argument(
        "--tapir-dist",
        default=os.environ.get("TAPIR_DIST") or str(BUILTIN_TAPIR_DIST),
    )

    args = parser.parse_args()
    if args.command == "create":
        create_handoff(args)
        return
    try:
        summary = validate_handoff(
            Path(args.handoff).resolve(),
            Path(args.tapir_dist).resolve(),
        )
    except (ValueError, subprocess.TimeoutExpired) as exc:
        raise SystemExit(f"Handoff validation failed: {exc}") from exc
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
