#!/usr/bin/env python3
"""Run TAPIR's single-client experiment and parse its detection output.

Deterministic, LLM-free. This is the mandatory stage-2 locator: it shells out
to TAPIR's compiled ``command/single-client-experiment.js`` to get candidate
locations (file:line:col + confidence) for a set of detection patterns, then
returns them as JSON.

TAPIR consumes a *pattern file* via ``require()``: a JSON array whose entries
have ``pattern`` and ``changelogId`` (produced by transform_patterns.py). This
wrapper can run all patterns from one file, or a single pattern at a time.

Usage:
    tapir_locate.py <target_dir> <pattern_file> \
        [--tapir-dist DIR] [--exclude-folders node_modules,packages] \
        [--per-pattern] [--out locations.json]

TAPIR dist resolution order: --tapir-dist, then $TAPIR_DIST, then the bundled
``static_components`` directory next to this skill.

Output JSON shape:
    [{"pattern_id": <changelogId int>, "file": "...", "line": N,
      "column": N, "confidence": "low"|"high", "backend": "tapir",
      "filter_applied": true}, ...]
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
from typing import Any, Dict, List

DEFAULT_TIMEOUT_SECONDS = 120
BUILTIN_TAPIR_DIST = Path(__file__).resolve().parents[1] / "static_components"
UNSUPPORTED_SOURCE_SUFFIXES = {
    ".jsx", ".ts", ".tsx", ".mts", ".cts",
}

# TAPIR prints e.g.:
#   Detection pattern 2 matched at src/index.js:10:4 with high confidence ...
_LINE_RE = re.compile(
    r"^Detection pattern (\d+) matched at (.*):(\d+):(\d+) "
    r"with (low|high) confidence(?:\s|$)"
)


def resolve_dist(cli_value: str | None) -> Path:
    dist = cli_value or os.environ.get("TAPIR_DIST")
    p = Path(dist) if dist else BUILTIN_TAPIR_DIST
    entry = p / "command" / "single-client-experiment.js"
    if not entry.exists():
        raise SystemExit(
            f"TAPIR single-client entry not found: {entry}\n"
            f"Install dependencies in {BUILTIN_TAPIR_DIST}, or set "
            f"--tapir-dist/$TAPIR_DIST to another TAPIR dist directory."
        )
    return p


def parse_detection_output(output: str) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    detection_lines = [
        line for line in output.splitlines()
        if line.startswith("Detection pattern ")
    ]
    for line_text in detection_lines:
        m = _LINE_RE.match(line_text)
        if not m:
            raise ValueError(f"Unparseable TAPIR detection line: {line_text}")
        pid, file, line, col, conf = m.groups()
        results.append({
            "pattern_id": int(pid),
            "file": file.replace("\\", "/"),
            "line": int(line),
            # TAPIR reports ESTree/Acorn zero-based UTF-16 code-unit columns.
            "column": int(col),
            "confidence": conf,
            "backend": "tapir",
            "filter_applied": True,
        })
    return results


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def utf16_column_to_utf8_byte(line_text: str, utf16_column: int) -> int:
    if utf16_column < 0:
        raise ValueError(f"Negative TAPIR column: {utf16_column}")
    prefix_bytes = line_text.encode("utf-16-le")[: utf16_column * 2]
    try:
        prefix = prefix_bytes.decode("utf-16-le")
    except UnicodeDecodeError as exc:
        raise ValueError(
            f"TAPIR column {utf16_column} splits a UTF-16 surrogate pair"
        ) from exc
    return len(prefix.encode("utf-8"))


def normalize_location_columns(
    results: List[Dict[str, Any]], target_dir: Path
) -> List[Dict[str, Any]]:
    source_cache: Dict[str, List[str]] = {}
    for result in results:
        relative_file = result["file"]
        source_path = target_dir / relative_file
        if not source_path.is_file():
            raise ValueError(
                f"TAPIR reported a file outside/missing from target: {relative_file}"
            )
        lines = source_cache.get(relative_file)
        if lines is None:
            lines = source_path.read_text(
                encoding="utf-8", errors="strict"
            ).splitlines()
            source_cache[relative_file] = lines
        line_number = result["line"]
        if line_number < 1 or line_number > len(lines):
            raise ValueError(
                f"TAPIR reported invalid line {line_number} for {relative_file}"
            )
        result["column"] = utf16_column_to_utf8_byte(
            lines[line_number - 1], result["column"]
        )
        result["column_unit"] = "utf8_byte"
    return results


def preparse_target_sources(
    target_dir: Path,
    dist: Path,
    exclude_folders: str,
    timeout_seconds: int,
) -> None:
    file_module = dist / "util" / "file.js"
    parser_module = dist / "util" / "parsing.js"
    if not file_module.exists() or not parser_module.exists():
        raise RuntimeError("TAPIR file/parser modules are missing from dist")
    excludes = [
        value.strip() for value in exclude_folders.split(",") if value.strip()
    ]
    script = (
        "const files=require(process.argv[1]);"
        "const parsing=require(process.argv[2]);"
        "(async()=>{"
        "const target=process.argv[3];"
        "const excluded=JSON.parse(process.argv[4]);"
        "const paths=await files.getFilesToAnalyze(target,excluded);"
        "for(const path of paths){"
        "try{await parsing.parseFileWithRecast(path);}"
        "catch(error){console.error(`TAPIR cannot parse ${path}`);process.exit(2);}"
        "}"
        "console.log(JSON.stringify({analyzed_files:paths.length}));"
        "})().catch(error=>{console.error(error.stack||error);process.exit(2);});"
    )
    try:
        proc = subprocess.run(
            [
                "node",
                "-e",
                script,
                str(file_module),
                str(parser_module),
                str(target_dir),
                json.dumps(excludes),
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            timeout=timeout_seconds,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(
            f"TAPIR pre-parse timed out after {timeout_seconds}s"
        ) from exc
    if proc.returncode != 0:
        raise RuntimeError(
            "TAPIR cannot completely parse the target source set: "
            + (proc.stderr or proc.stdout).strip()
        )


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


def run_tapir(
    target_dir: str,
    pattern_file: str,
    dist: Path,
    exclude_folders: str,
    timeout_seconds: int,
) -> List[Dict[str, Any]]:
    entry = str(dist / "command" / "single-client-experiment.js")
    command = ["node", entry, target_dir, pattern_file]
    if exclude_folders:
        command += ["--exclude-folders", exclude_folders]
    try:
        proc = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            timeout=timeout_seconds,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(
            f"TAPIR timed out after {timeout_seconds}s for {pattern_file}"
        ) from exc
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout or "").strip()
        raise RuntimeError(
            f"TAPIR failed with exit code {proc.returncode} for {pattern_file}: "
            f"{detail}"
        )
    return normalize_location_columns(
        parse_detection_output(proc.stdout or ""),
        Path(target_dir),
    )


def run_per_pattern(
    target_dir: str,
    patterns: List[Dict[str, Any]],
    dist: Path,
    exclude_folders: str,
    timeout_seconds: int,
) -> List[Dict[str, Any]]:
    """Run each pattern in isolation (matches original one-pattern-at-a-time flow)."""
    all_results: List[Dict[str, Any]] = []
    for pat in patterns:
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as tf:
            json.dump([pat], tf)
            tmp = tf.name
        try:
            all_results.extend(
                run_tapir(
                    target_dir,
                    tmp,
                    dist,
                    exclude_folders,
                    timeout_seconds,
                )
            )
        finally:
            os.unlink(tmp)
    return all_results


def dedup_locations(results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Collapse duplicate hits at the same (pattern_id, file, line, column).

    One BC can yield several patterns (e.g. a `call` and a `read` pattern for
    the same method), so TAPIR may report the same source location more than
    once. Keep a single entry per location, preferring `high` over `low`
    confidence. Order is preserved by first appearance.
    """
    best: Dict[tuple, Dict[str, Any]] = {}
    order: List[tuple] = []
    for r in results:
        key = (r["pattern_id"], r["file"], r["line"], r["column"])
        if key not in best:
            best[key] = r
            order.append(key)
        elif r.get("confidence") == "high" and best[key].get("confidence") != "high":
            best[key] = r
    return [best[k] for k in order]


def find_unsupported_sources(target: Path, exclude_folders: str) -> List[str]:
    excluded = {
        value.strip() for value in exclude_folders.split(",") if value.strip()
    }
    unsupported: List[str] = []
    for root, dirs, files in os.walk(target):
        dirs[:] = [name for name in dirs if name not in excluded]
        for filename in files:
            path = Path(root) / filename
            if path.suffix.lower() in UNSUPPORTED_SOURCE_SUFFIXES:
                unsupported.append(path.relative_to(target).as_posix())
    return unsupported


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


def build_run_report(
    target_dir: Path,
    pattern_path: Path,
    locations_path: Path,
    results: List[Dict[str, Any]],
    unsupported_sources: List[str],
) -> Dict[str, Any]:
    return {
        "schema_version": "1",
        "status": "passed",
        "backend": "tapir",
        "target_dir": str(target_dir.resolve()),
        "pattern_file": str(pattern_path.resolve()),
        "pattern_file_sha256": sha256(pattern_path),
        "locations_file": str(locations_path.resolve()),
        "locations_file_sha256": sha256(locations_path),
        "location_count": len(results),
        "unsupported_sources": unsupported_sources,
        "complete": not unsupported_sources,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description="Locate BC-affected usages with TAPIR.")
    ap.add_argument("target_dir", help="Client directory to scan")
    ap.add_argument("pattern_file", help="TAPIR pattern file (tapir.json / tapirN.json)")
    ap.add_argument("--tapir-dist", default=None, help="Path to tapir dist dir")
    ap.add_argument("--exclude-folders", default="node_modules,packages")
    ap.add_argument("--per-pattern", action="store_true",
                    help="Run one pattern at a time (isolates matches per changelogId)")
    ap.add_argument(
        "--timeout-seconds",
        type=int,
        default=DEFAULT_TIMEOUT_SECONDS,
        help=f"Per TAPIR invocation timeout (default: {DEFAULT_TIMEOUT_SECONDS})",
    )
    ap.add_argument(
        "--allow-unsupported-files",
        action="store_true",
        help=(
            "Allow TAPIR to scan the supported JS subset even when JSX/TypeScript "
            "files exist; the run is incomplete for those files and must be "
            "reported as such"
        ),
    )
    ap.add_argument(
        "--run-report",
        help=(
            "Write a TAPIR run report used by the Stage-2 completion gate; "
            "requires --out"
        ),
    )
    ap.add_argument("--out", default=None, help="Write locations JSON here (default: stdout)")
    args = ap.parse_args()

    dist = resolve_dist(args.tapir_dist)
    target_path = Path(args.target_dir)
    if not target_path.is_dir():
        raise SystemExit(f"Target directory not found: {target_path}")
    unsupported_sources = find_unsupported_sources(
        target_path, args.exclude_folders
    )
    if unsupported_sources and not args.allow_unsupported_files:
        preview = "\n".join(unsupported_sources[:20])
        raise SystemExit(
            "TAPIR does not reliably parse JSX/TypeScript files. "
            "Run a supported-language workflow or explicitly use "
            "--allow-unsupported-files and report incomplete coverage:\n"
            + preview
        )
    if unsupported_sources:
        print(
            "WARNING: TAPIR coverage excludes unsupported source files:\n"
            + "\n".join(unsupported_sources[:20]),
            file=sys.stderr,
        )
    pattern_path = Path(args.pattern_file)
    if not pattern_path.exists():
        raise SystemExit(f"Pattern file not found: {pattern_path}")
    try:
        patterns = validate_patterns(
            json.loads(pattern_path.read_text(encoding="utf-8"))
        )
    except (json.JSONDecodeError, ValueError) as exc:
        raise SystemExit(f"Invalid pattern file {pattern_path}: {exc}") from exc

    try:
        preparse_target_sources(
            target_path,
            dist,
            args.exclude_folders,
            args.timeout_seconds,
        )
        if args.per_pattern:
            results = run_per_pattern(
                str(target_path),
                patterns,
                dist,
                args.exclude_folders,
                args.timeout_seconds,
            )
        else:
            results = run_tapir(
                str(target_path),
                str(pattern_path),
                dist,
                args.exclude_folders,
                args.timeout_seconds,
            )
    except (RuntimeError, ValueError) as exc:
        raise SystemExit(str(exc)) from exc

    results = dedup_locations(results)

    payload = json.dumps(results, ensure_ascii=False, indent=2)
    if args.out:
        output_path = Path(args.out)
        write_json_atomic(output_path, results)
        if args.run_report:
            write_json_atomic(
                Path(args.run_report),
                build_run_report(
                    target_path,
                    pattern_path,
                    output_path,
                    results,
                    unsupported_sources,
                ),
            )
        print(f"Wrote {len(results)} locations to {args.out}")
    else:
        if args.run_report:
            raise SystemExit("--run-report requires --out")
        print(payload)


if __name__ == "__main__":
    main()
