#!/usr/bin/env python3
"""Extract enclosing AST context snippets for TAPIR-reported locations.

Deterministic, LLM-free. Given a JavaScript file and one or more
(line, column) hits from TAPIR, grow each hit up to the smallest enclosing
"complete syntactic unit" (function, method, class, control-flow statement)
and emit that snippet. This is the same context the original pipeline fed to
the repair model; here the agent reads the snippets and decides the fix.

Requires the ``tree_sitter`` and ``tree_sitter_javascript`` Python packages:
    pip install tree_sitter tree_sitter_javascript

Usage:
    ast_context.py <file.js> --loc LINE:COL [--loc LINE:COL ...] [--json]
    ast_context.py <file.js> --locations-file locations.json [--json]

With --locations-file, also pass --target-root. The target file's exact relative
path under that root must equal the location's "file". Output (with --json) is:
    {"start_byte": N, "end_byte": N, "node_type": "...", "text": "<snippet>",
     "locations": [{...original location metadata...}]}
"""
import argparse
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

COMPLETE_UNITS = {
    "function_declaration", "method_definition", "arrow_function",
    "class_declaration", "if_statement", "for_statement", "while_statement",
    "do_statement", "switch_statement", "try_statement",
}


def _load_parser():
    try:
        import tree_sitter_javascript as tsjs
        from tree_sitter import Language, Parser
    except ImportError as e:
        raise SystemExit(
            "Missing dependency: pip install tree_sitter tree_sitter_javascript\n"
            f"(import error: {e})"
        )
    return Parser(Language(tsjs.language()))


def extract_context(root, line: int, column: int) -> Optional[Any]:
    target_point = (line - 1, column)

    def find_containing(node, point):
        # tree-sitter end points are exclusive.
        if not (node.start_point <= point < node.end_point):
            return None
        for child in node.children:
            r = find_containing(child, point)
            if r:
                return r
        return node

    node = find_containing(root, target_point)
    if not node:
        return None

    target_line = line - 1
    while node.parent:
        start_line, end_line = node.start_point[0], node.end_point[0]
        if start_line <= target_line <= end_line and node.type in COMPLETE_UNITS:
            break
        if node.parent.type != "program":
            node = node.parent
        else:
            break
    return node


def _matches(entry_file: str, target: Path, target_root: Path) -> bool:
    entry = entry_file.replace("\\", "/")
    if entry.startswith("./"):
        entry = entry[2:]
    entry_path = Path(entry)
    if entry_path.is_absolute() or ".." in entry_path.parts:
        raise SystemExit(f"Unsafe location path: {entry_file}")
    try:
        target_relative = target.resolve().relative_to(target_root.resolve())
    except ValueError as exc:
        raise SystemExit(
            f"Target file {target} is outside target root {target_root}"
        ) from exc
    return target_relative.as_posix() == entry


def gather_locations(args, target: Path) -> List[Dict[str, Any]]:
    locations: List[Dict[str, Any]] = []
    for spec in args.loc or []:
        line_s, col_s = spec.split(":")
        locations.append({
            "line": int(line_s),
            "column": int(col_s),
            "file": target.resolve().as_posix(),
            "pattern_id": None,
            "confidence": "unknown",
            "backend": "manual",
        })
    if args.locations_file:
        if not args.target_root:
            raise SystemExit("--target-root is required with --locations-file")
        target_root = Path(args.target_root)
        if not target_root.is_dir():
            raise SystemExit(f"Target root not found: {target_root}")
        data = json.loads(Path(args.locations_file).read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise SystemExit("locations.json must be a JSON array")
        for e in data:
            if not isinstance(e, dict):
                raise SystemExit("Each location must be a JSON object")
            if _matches(e.get("file", ""), target, target_root):
                location = dict(e)
                location["line"] = int(e["line"])
                location["column"] = int(e["column"])
                locations.append(location)
    # de-dup while preserving order
    seen = set()
    unique: List[Dict[str, Any]] = []
    for location in locations:
        key = (
            location.get("pattern_id"),
            location.get("file"),
            location["line"],
            location["column"],
            location.get("backend"),
            location.get("confidence"),
            location.get("filter_applied"),
        )
        if key not in seen:
            seen.add(key)
            unique.append(location)
    return unique


def main() -> None:
    ap = argparse.ArgumentParser(description="Extract enclosing AST snippets for TAPIR hits.")
    ap.add_argument("file", help="JavaScript file to slice")
    ap.add_argument("--loc", action="append", help="LINE:COL (repeatable)")
    ap.add_argument("--locations-file", help="locations.json from tapir_locate.py")
    ap.add_argument(
        "--target-root",
        help="Target project root used to match exact relative location paths",
    )
    ap.add_argument("--json", action="store_true", help="Emit JSON (default: readable text)")
    args = ap.parse_args()

    target = Path(args.file)
    if not target.exists():
        raise SystemExit(f"File not found: {target}")
    locations = gather_locations(args, target)
    if not locations:
        raise SystemExit(
            "No locations match this exact file path "
            "(use --loc or check locations.json paths)."
        )

    parser = _load_parser()
    code_bytes = target.read_bytes()
    tree = parser.parse(code_bytes)
    root = tree.root_node

    grouped: Dict[tuple, Dict[str, Any]] = {}
    order: List[tuple] = []
    skipped: List[Dict[str, Any]] = []
    for location in locations:
        line = location["line"]
        column = location["column"]
        node = extract_context(root, line, column)
        if node is None:
            skipped.append(location)
            continue
        rng = (node.start_byte, node.end_byte)
        if rng not in grouped:
            grouped[rng] = {
                "start_byte": node.start_byte,
                "end_byte": node.end_byte,
                "node_type": node.type,
                "text": code_bytes[node.start_byte:node.end_byte].decode(
                    "utf-8", errors="replace"
                ),
                "locations": [],
            }
            order.append(rng)
        grouped[rng]["locations"].append(location)

    if skipped:
        raise SystemExit(
            "Some locations were outside the parsed syntax tree: "
            + json.dumps(skipped, ensure_ascii=False)
        )
    results = [grouped[rng] for rng in order]

    if args.json:
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        for r in results:
            first = r["locations"][0]
            print(f"--- {target}:{first['line']}:{first['column']} [{r['node_type']}] "
                  f"bytes {r['start_byte']}-{r['end_byte']} ---")
            pattern_ids = [
                location.get("pattern_id") for location in r["locations"]
                if location.get("pattern_id") is not None
            ]
            if pattern_ids:
                print(f"patterns: {pattern_ids}")
            print(r["text"])
            print()


if __name__ == "__main__":
    main()
