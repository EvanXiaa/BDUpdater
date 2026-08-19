#!/usr/bin/env python3
"""Initialize or validate a per-BC Stage-2 repair report."""
import argparse
import hashlib
import json
import os
import tempfile
from pathlib import Path
from typing import Any

from handoff import load_json, resolve_artifact, sha256, validate_handoff

BUILTIN_TAPIR_DIST = Path(__file__).resolve().parents[1] / "static_components"

ALLOWED_STATUSES = {
    "repaired",
    "unaffected",
    "not_found",
    "manual",
    "blocked",
    "environment_checked",
}
LOCKFILE_NAMES = {
    "package-lock.json",
    "npm-shrinkwrap.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "bun.lock",
    "bun.lockb",
}


def load(path: Path) -> Any:
    return load_json(path)


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


def initialize(args: argparse.Namespace) -> None:
    handoff_path = Path(args.handoff).resolve()
    preflight_path = Path(args.preflight).resolve()
    tapir_run_path = Path(args.tapir_run).resolve()
    try:
        handoff_summary = validate_handoff(
            handoff_path,
            Path(args.tapir_dist).resolve(),
        )
    except ValueError as exc:
        raise SystemExit(f"Handoff validation failed: {exc}") from exc
    handoff = load(handoff_path)
    preflight = load(preflight_path)
    tapir_run = load(tapir_run_path)
    if preflight.get("status") != "passed":
        raise SystemExit("Preflight report is not passed")
    if preflight.get("handoff_sha256") != sha256(handoff_path):
        raise SystemExit("Preflight handoff hash mismatch")
    if tapir_run.get("status") != "passed" or tapir_run.get("backend") != "tapir":
        raise SystemExit("TAPIR baseline run report is not passed")
    if tapir_run.get("complete") is not True:
        raise SystemExit("TAPIR baseline is incomplete; repair completion is blocked")
    if tapir_run.get("pattern_file_sha256") != handoff["pattern_file_sha256"]:
        raise SystemExit("TAPIR run pattern hash does not match handoff")
    if (
        Path(tapir_run.get("target_dir", "")).resolve()
        != Path(preflight.get("target_client_dir", "")).resolve()
    ):
        raise SystemExit("TAPIR run target differs from preflight target")
    locations_path = Path(tapir_run["locations_file"]).resolve()
    if not locations_path.is_file():
        raise SystemExit("TAPIR locations file is missing")
    if tapir_run.get("locations_file_sha256") != sha256(locations_path):
        raise SystemExit("TAPIR locations hash mismatch")

    supplemental_path = (
        Path(args.supplemental_run).resolve()
        if args.supplemental_run else None
    )
    supplemental = None
    required_supplemental_ids = set(
        preflight.get("supplemental_bc_ids") or []
    )
    if preflight.get("supplemental_required") is True:
        if supplemental_path is None:
            raise SystemExit(
                "Preflight requires a supplemental ripgrep run report"
            )
        supplemental = load(supplemental_path)
        if (
            supplemental.get("status") != "passed"
            or supplemental.get("backend") != "ripgrep"
        ):
            raise SystemExit("Supplemental run report is not passed")
        if (
            Path(supplemental.get("target_dir", "")).resolve()
            != Path(preflight["target_client_dir"]).resolve()
        ):
            raise SystemExit(
                "Supplemental run target differs from preflight target"
            )
        if (
            supplemental.get("pattern_file_sha256")
            != handoff["pattern_file_sha256"]
        ):
            raise SystemExit("Supplemental run pattern hash mismatch")
        if not required_supplemental_ids.issubset(
            set(supplemental.get("attempted_bc_ids") or [])
        ):
            raise SystemExit(
                "Supplemental run did not attempt every required BC"
            )

    bc_path = resolve_artifact(handoff_path, handoff["bc_list"])
    bc_list = load(bc_path)
    locations = load(locations_path)
    hit_counts = {}
    for location in locations:
        pattern_id = location.get("pattern_id")
        hit_counts[pattern_id] = hit_counts.get(pattern_id, 0) + 1
    entries = []
    for bc in bc_list["breaking_changes"]:
        entries.append({
            "bc_id": bc["Id"],
            "status": "pending",
            "hit_count": hit_counts.get(bc["Id"], 0),
            "changed_files": [],
            "evidence": [],
            "notes": "",
        })
    report = {
        "schema_version": "1",
        "handoff": str(handoff_path),
        "handoff_sha256": sha256(handoff_path),
        "bc_list_sha256": handoff_summary["bc_list_sha256"],
        "pattern_file_sha256": handoff_summary["pattern_file_sha256"],
        "preflight": str(preflight_path),
        "preflight_sha256": sha256(preflight_path),
        "tapir_run": str(tapir_run_path),
        "tapir_run_sha256": sha256(tapir_run_path),
        "supplemental_run": (
            str(supplemental_path) if supplemental_path else None
        ),
        "supplemental_run_sha256": (
            sha256(supplemental_path) if supplemental_path else None
        ),
        "locations_sha256": tapir_run["locations_file_sha256"],
        "target_client_dir": preflight["target_client_dir"],
        "package_name": handoff_summary["package_name"],
        "new_version": handoff_summary["new_version"],
        "entries": entries,
        "validation": {
            "overall": "pending",
            "commands": [],
        },
    }
    write_atomic(Path(args.out), report)
    print(f"Wrote repair report template to {args.out}")


def validate(args: argparse.Namespace) -> None:
    report = load(Path(args.report))
    if not isinstance(report, dict) or report.get("schema_version") != "1":
        raise SystemExit("Invalid repair report schema_version")
    required_top = {
        "handoff",
        "handoff_sha256",
        "bc_list_sha256",
        "pattern_file_sha256",
        "preflight",
        "preflight_sha256",
        "tapir_run",
        "tapir_run_sha256",
        "supplemental_run",
        "supplemental_run_sha256",
        "locations_sha256",
        "target_client_dir",
        "package_name",
        "new_version",
        "entries",
        "validation",
    }
    missing = sorted(required_top - set(report))
    if missing:
        raise SystemExit(f"Repair report missing fields: {missing}")
    for field in ("target_client_dir", "package_name", "new_version"):
        if not isinstance(report[field], str) or not report[field].strip():
            raise SystemExit(f"Repair report {field} must be non-empty")

    handoff_path = Path(report["handoff"]).resolve()
    preflight_path = Path(report["preflight"]).resolve()
    tapir_run_path = Path(report["tapir_run"]).resolve()
    for path, hash_field in (
        (handoff_path, "handoff_sha256"),
        (preflight_path, "preflight_sha256"),
        (tapir_run_path, "tapir_run_sha256"),
    ):
        if not path.is_file() or sha256(path) != report[hash_field]:
            raise SystemExit(f"Repair report artifact/hash mismatch: {path}")
    try:
        handoff_summary = validate_handoff(
            handoff_path,
            Path(args.tapir_dist).resolve(),
        )
    except ValueError as exc:
        raise SystemExit(f"Handoff validation failed: {exc}") from exc
    if report["bc_list_sha256"] != handoff_summary["bc_list_sha256"]:
        raise SystemExit("Repair report BC list hash mismatch")
    if report["pattern_file_sha256"] != handoff_summary["pattern_file_sha256"]:
        raise SystemExit("Repair report pattern hash mismatch")

    handoff = load(handoff_path)
    bc_path = resolve_artifact(handoff_path, handoff["bc_list"])
    expected_bc_ids = {
        bc["Id"] for bc in load(bc_path)["breaking_changes"]
    }
    preflight = load(preflight_path)
    if preflight.get("status") != "passed":
        raise SystemExit("Preflight is not passed")
    if (
        preflight.get("handoff_sha256") != report["handoff_sha256"]
        or preflight.get("package_name") != report["package_name"]
        or preflight.get("new_version") != report["new_version"]
        or preflight.get("target_client_dir") != report["target_client_dir"]
    ):
        raise SystemExit("Repair report does not match preflight identity")
    tapir_run = load(tapir_run_path)
    if (
        tapir_run.get("status") != "passed"
        or tapir_run.get("backend") != "tapir"
        or tapir_run.get("complete") is not True
        or tapir_run.get("pattern_file_sha256") != report["pattern_file_sha256"]
        or tapir_run.get("locations_file_sha256") != report["locations_sha256"]
    ):
        raise SystemExit("Repair report is not bound to a complete TAPIR baseline")
    if (
        Path(tapir_run.get("target_dir", "")).resolve()
        != Path(preflight.get("target_client_dir", "")).resolve()
    ):
        raise SystemExit("TAPIR run target differs from preflight target")

    required_supplemental_ids = set(
        preflight.get("supplemental_bc_ids") or []
    )
    if preflight.get("supplemental_required") is True:
        supplemental_value = report.get("supplemental_run")
        supplemental_hash = report.get("supplemental_run_sha256")
        if not supplemental_value or not supplemental_hash:
            raise SystemExit("Required supplemental run is missing")
        supplemental_path = Path(supplemental_value).resolve()
        if (
            not supplemental_path.is_file()
            or sha256(supplemental_path) != supplemental_hash
        ):
            raise SystemExit("Supplemental run artifact/hash mismatch")
        supplemental = load(supplemental_path)
        if (
            supplemental.get("status") != "passed"
            or supplemental.get("backend") != "ripgrep"
            or Path(supplemental.get("target_dir", "")).resolve()
            != Path(preflight["target_client_dir"]).resolve()
            or supplemental.get("pattern_file_sha256")
            != report["pattern_file_sha256"]
            or not required_supplemental_ids.issubset(
                set(supplemental.get("attempted_bc_ids") or [])
            )
        ):
            raise SystemExit(
                "Supplemental run does not satisfy preflight requirements"
            )
    elif report.get("supplemental_run") or report.get(
        "supplemental_run_sha256"
    ):
        raise SystemExit(
            "Unexpected supplemental run when preflight did not require one"
        )

    entries = report.get("entries")
    if not isinstance(entries, list) or not entries:
        raise SystemExit("Repair report entries must be a non-empty array")
    ids = set()
    pending = []
    incomplete = []
    for entry in entries:
        bc_id = entry.get("bc_id")
        if isinstance(bc_id, bool) or not isinstance(bc_id, int):
            raise SystemExit(f"Invalid repair report bc_id={bc_id!r}")
        if bc_id in ids:
            raise SystemExit(f"Duplicate repair report bc_id={bc_id}")
        ids.add(bc_id)
        status = entry.get("status")
        if status == "pending":
            pending.append(bc_id)
        elif status not in ALLOWED_STATUSES:
            raise SystemExit(f"Invalid status={status!r} for bc_id={bc_id}")
        elif status in {"blocked", "manual"}:
            incomplete.append(bc_id)
        for list_field in ("changed_files", "evidence"):
            if not isinstance(entry.get(list_field), list) or not all(
                isinstance(value, str) for value in entry[list_field]
            ):
                raise SystemExit(
                    f"Invalid {list_field} for bc_id={bc_id}"
                )
        if not isinstance(entry.get("notes"), str):
            raise SystemExit(f"Invalid notes for bc_id={bc_id}")
    if ids != expected_bc_ids:
        raise SystemExit(
            f"Repair report BC IDs differ from handoff: "
            f"expected={sorted(expected_bc_ids)}, actual={sorted(ids)}"
        )
    if pending:
        raise SystemExit(f"Repair report still has pending BCs: {pending}")
    if incomplete:
        raise SystemExit(
            f"Repair remains manual/blocked for BCs: {incomplete}"
        )
    validation = report.get("validation") or {}
    overall = validation.get("overall")
    if overall not in {"passed", "unverified", "failed"}:
        raise SystemExit("validation.overall must be passed, unverified, or failed")
    if overall == "failed":
        raise SystemExit("Repair validation failed; do not report completion")
    if overall == "unverified" and not args.allow_unverified:
        raise SystemExit(
            "Repair is unverified; rerun with --allow-unverified only when validation "
            "is genuinely unavailable and report that limitation"
        )
    commands = validation.get("commands")
    if not isinstance(commands, list):
        raise SystemExit("validation.commands must be an array")
    for entry in commands:
        if (
            not isinstance(entry, dict)
            or not isinstance(entry.get("command"), str)
            or entry.get("status") not in {"passed", "skipped", "failed"}
        ):
            raise SystemExit("Invalid validation command record")
        if entry["status"] == "failed":
            raise SystemExit("A recorded validation command failed")
    expected_commands = preflight.get("validation_commands")
    actual_commands = [entry.get("command") for entry in commands]
    if overall == "passed":
        if not commands:
            raise SystemExit("Passed validation requires at least one command")
        if actual_commands != expected_commands:
            raise SystemExit(
                "Validation commands differ from preflight declaration"
            )
        for entry in commands:
            if entry.get("status") != "passed":
                raise SystemExit(
                    "All required validation commands must be recorded as passed"
                )

    # Deterministic completion conditions apply even when tests/builds are
    # explicitly unverified.
    target = Path(report["target_client_dir"])
    package_json_path = target / "package.json"
    package_json = load(package_json_path)
    dependency_section = preflight.get("dependency_section")
    dependency_spec = (
        (package_json.get(dependency_section) or {}).get(
            report["package_name"]
        )
        if dependency_section else None
    )
    target_version = report["new_version"].lstrip("v")
    accepted_specs = {
        target_version,
        f"^{target_version}",
        f"~{target_version}",
        f"workspace:{target_version}",
        f"workspace:^{target_version}",
        f"workspace:~{target_version}",
    }
    if dependency_spec not in accepted_specs:
        raise SystemExit(
            f"Dependency {report['package_name']} was not updated to "
            f"{report['new_version']} in {dependency_section}"
        )

    current_lockfiles = {
        name: sha256(target / name)
        for name in LOCKFILE_NAMES
        if (target / name).is_file()
    }
    prior_lockfiles = preflight.get("lockfile_sha256") or {}
    policy = preflight.get("lockfile_policy")
    if policy == "preserve" and current_lockfiles != prior_lockfiles:
        raise SystemExit("Lockfiles changed despite preserve policy")
    if policy == "none" and current_lockfiles:
        raise SystemExit("Lockfiles exist despite none policy")
    if policy == "update":
        if not current_lockfiles:
            raise SystemExit("No lockfile exists after update policy")
        if current_lockfiles == prior_lockfiles:
            raise SystemExit("Lockfile did not change under update policy")
        manager = preflight.get("package_manager")
        passed_commands = [
            entry["command"] for entry in commands
            if entry["status"] == "passed"
        ]
        if not any(
            command.strip().startswith(f"{manager} ")
            for command in passed_commands
        ):
            raise SystemExit(
                "Update lockfile policy requires a passed package-manager command"
            )
    print(f"Repair report valid: {len(entries)} BC dispositions, validation={overall}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    init = subparsers.add_parser("init")
    init.add_argument("--handoff", required=True)
    init.add_argument("--preflight", required=True)
    init.add_argument("--tapir-run", required=True)
    init.add_argument("--supplemental-run")
    init.add_argument(
        "--tapir-dist",
        default=os.environ.get("TAPIR_DIST") or str(BUILTIN_TAPIR_DIST),
    )
    init.add_argument("--out", required=True)

    check = subparsers.add_parser("validate")
    check.add_argument("report")
    check.add_argument(
        "--tapir-dist",
        default=os.environ.get("TAPIR_DIST") or str(BUILTIN_TAPIR_DIST),
    )
    check.add_argument("--allow-unverified", action="store_true")

    args = parser.parse_args()
    if args.command == "init":
        initialize(args)
    else:
        validate(args)


if __name__ == "__main__":
    main()
