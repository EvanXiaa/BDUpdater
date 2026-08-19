#!/usr/bin/env python3
"""Run the executable Stage-2 preflight and write a signed input summary."""
import argparse
import importlib
import json
import os
import shutil
import tempfile
from pathlib import Path
from typing import Any

from handoff import sha256, validate_handoff

BUILTIN_TAPIR_DIST = Path(__file__).resolve().parents[1] / "static_components"

LOCKFILES = {
    "package-lock.json": "npm",
    "npm-shrinkwrap.json": "npm",
    "pnpm-lock.yaml": "pnpm",
    "yarn.lock": "yarn",
    "bun.lock": "bun",
    "bun.lockb": "bun",
}


def write_atomic(path: Path, value: Any) -> None:
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


def detect_package_manager(
    target: Path,
) -> tuple[str | None, list[str], dict[str, str]]:
    present = [
        (lockfile, manager)
        for lockfile, manager in LOCKFILES.items()
        if (target / lockfile).exists()
    ]
    managers = sorted({manager for _, manager in present})
    lockfiles = [lockfile for lockfile, _ in present]
    hashes = {
        lockfile: sha256(target / lockfile)
        for lockfile in lockfiles
    }
    return (
        managers[0] if len(managers) == 1 else None,
        lockfiles,
        hashes,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--handoff", required=True)
    parser.add_argument(
        "--tapir-dist",
        default=os.environ.get("TAPIR_DIST") or str(BUILTIN_TAPIR_DIST),
    )
    parser.add_argument("--target-client-dir", required=True)
    parser.add_argument("--package-manager", required=True)
    parser.add_argument(
        "--lockfile-policy",
        choices=["update", "preserve", "none"],
        required=True,
    )
    parser.add_argument(
        "--validation-command",
        action="append",
        required=True,
        help="Repeat for every required validation command",
    )
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    target = Path(args.target_client_dir).resolve()
    if not target.is_dir():
        raise SystemExit(f"Target client directory not found: {target}")
    package_json_path = target / "package.json"
    if not package_json_path.is_file():
        raise SystemExit(f"package.json not found in {target}")
    try:
        package_json = json.loads(package_json_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid package.json: {exc}") from exc

    handoff_path = Path(args.handoff).resolve()
    try:
        handoff_summary = validate_handoff(
            handoff_path,
            Path(args.tapir_dist).resolve(),
        )
    except ValueError as exc:
        raise SystemExit(f"Handoff validation failed: {exc}") from exc

    for module in ("tree_sitter", "tree_sitter_javascript"):
        try:
            importlib.import_module(module)
        except ImportError as exc:
            raise SystemExit(f"Missing Python dependency: {module}") from exc

    if shutil.which("node") is None:
        raise SystemExit("node is required")
    if shutil.which(args.package_manager) is None:
        raise SystemExit(f"Package manager not found: {args.package_manager}")

    detected_manager, lockfiles, lockfile_hashes = detect_package_manager(target)
    if detected_manager and detected_manager != args.package_manager:
        raise SystemExit(
            f"Package manager mismatch: lockfile implies {detected_manager}, "
            f"requested {args.package_manager}"
        )
    if args.lockfile_policy == "update" and not lockfiles:
        raise SystemExit("lockfile-policy=update requires an existing lockfile")
    if args.lockfile_policy == "none" and lockfiles:
        raise SystemExit(
            "lockfile-policy=none conflicts with existing lockfiles: "
            + ", ".join(lockfiles)
        )

    package_name = handoff_summary["package_name"]
    dependency_sections = (
        "dependencies",
        "devDependencies",
        "optionalDependencies",
        "peerDependencies",
    )
    current_version = None
    dependency_section = None
    for section in dependency_sections:
        value = (package_json.get(section) or {}).get(package_name)
        if value is not None:
            current_version = value
            dependency_section = section
            break
    if current_version is None:
        raise SystemExit(
            f"Target package.json does not declare handoff package {package_name!r}"
        )
    commands = [command.strip() for command in args.validation_command]
    if not all(commands):
        raise SystemExit("Validation commands must be non-empty")

    report = {
        "schema_version": "1",
        "status": "passed",
        "handoff": str(handoff_path),
        "handoff_sha256": sha256(handoff_path),
        "package_name": package_name,
        "old_dependency_spec": current_version,
        "dependency_section": dependency_section,
        "new_version": handoff_summary["new_version"],
        "target_client_dir": str(target),
        "package_manager": args.package_manager,
        "lockfile_policy": args.lockfile_policy,
        "lockfiles": lockfiles,
        "lockfile_sha256": lockfile_hashes,
        "validation_commands": commands,
        "supplemental_required": handoff_summary["supplemental_required"],
        "supplemental_bc_ids": handoff_summary["supplemental_bc_ids"],
    }
    write_atomic(Path(args.out), report)
    print(f"Stage-2 preflight passed; wrote {args.out}")


if __name__ == "__main__":
    main()
