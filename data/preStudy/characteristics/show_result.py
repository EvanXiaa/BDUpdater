import json
import csv
import os

# Directory containing result files
input_dir = ""

categories = [
    "W1", "W2", "W3", "W4", "W5", "W6",
    "W7-a", "W7-b",
    "W8",
    "W9",
    "H1-a", "H1-b", "H2", "H3",
    "Y1"
]

groups = {
    "Describe Object of Change": ["W1", "W2", "W6"],
    "Describe characteristics of Change": ["W3", "W4", "W5", "W9"],
    "Describe Environment/Dependency Change": ["W7-a", "W7-b"],
    "Describe Downstream Adaptation": ["H1-a", "H1-b", "H2", "H3"],
    "Describe Implicit Changes": ["W8"],
}


group2_name = "Describe Object of Change"
group1_name = "Describe characteristics of Change"
group3_name = "Describe Downstream Adaptation"
count_g1_true_g2_false = 0
count_g1or2_true_g3_false = 0

headers = ["repo"] + categories

# Output path
output_csv_path = ""

key_counts_true = {cat: 0 for cat in categories}
total_files = 0


group_any_true = {g: 0 for g in groups}
group_all_true = {g: 0 for g in groups}
group_coverage_sum = {g: 0 for g in groups}

with open(output_csv_path, mode='w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()

    for root, _, files in os.walk(input_dir):
        for file in sorted(files):
            if not file.endswith(".json"):
                continue

            file_path = os.path.join(root, file)
            with open(file_path) as json_file:
                result = json.load(json_file)

            try:
                base = os.path.basename(file)
                repo_name = base.split("RELEASE_NOTE")[0].replace("_","/")[1:-1]
            except Exception:
                repo_name = "UNKNOWN"

            present_map = {}

            has_w7a = "W7-a" in result
            has_w7b = "W7-b" in result
            has_w7  = "W7" in result

            for cat in categories:
                if cat in ("W7-a", "W7-b") and not (has_w7a or has_w7b):
                    val = result.get("W7", {}).get("present", False)
                else:
                    val = result.get(cat, {}).get("present", False)
                    present_map[cat] = bool(val)

            row = {"repo": repo_name}
            row.update(present_map)
            writer.writerow(row)

            for cat in categories:
                if present_map[cat]:
                    key_counts_true[cat] += 1

            for gname, gkeys in groups.items():
                n_keys = len(gkeys)
                n_present = sum(1 for k in gkeys if present_map.get(k, False))
                if n_present > 0:
                    group_any_true[gname] += 1
                if n_present == n_keys:
                    group_all_true[gname] += 1
                group_coverage_sum[gname] += (n_present / n_keys)

            g1_present = any(present_map.get(k, False) for k in groups[group1_name])
            g2_present = any(present_map.get(k, False) for k in groups[group2_name])
            g3_present = any(present_map.get(k, False) for k in groups[group3_name])
            if g1_present and not g2_present:
                count_g1_true_g2_false += 1
            if (g1_present or g2_present) and not g3_present:
                count_g1or2_true_g3_false += 1
            # <<<
            total_files += 1

# ---- Print summaries --------------------------------------------------------
print("\n=== Per-Key True Percentages ===")
for cat in categories:
    if total_files > 0:
        pct = (key_counts_true[cat] / total_files) * 100
        print(f"{cat}: {pct:.2f}% ({key_counts_true[cat]}/{total_files})")
    else:
        print(f"{cat}: N/A (no files processed)")

print("\n=== Group Existence Percentages ===")
if total_files == 0:
    print("N/A (no files processed)")
else:
    for gname, gkeys in groups.items():
        any_pct = (group_any_true[gname] / total_files) * 100
        all_pct = (group_all_true[gname] / total_files) * 100
        avg_cov = (group_coverage_sum[gname] / total_files) * 100  # average % of keys present in this group
        keys_str = ", ".join(gkeys)
        print(f"\n{gname} [{keys_str}]")
        print(f"  Any-present: {any_pct:.2f}% ({group_any_true[gname]}/{total_files})")
        print(f"  All-present: {all_pct:.2f}% ({group_all_true[gname]}/{total_files})")
        print(f"  Avg coverage across repos: {avg_cov:.2f}%")

print(f"\nCSV written to: {os.path.abspath(output_csv_path)}")

print(f"\nNumber of repos with '{group1_name}' TRUE and '{group2_name}' FALSE: "
      f"{count_g1_true_g2_false}/{total_files}")
if total_files:
    pct = (count_g1_true_g2_false / total_files) * 100
    print(f"That is {pct:.2f}% of all repos.")

print(f"\nNumber of repos with "
      f"({group1_name} OR {group2_name}) TRUE and {group3_name} FALSE: "
      f"{count_g1or2_true_g3_false}/{total_files}")
if total_files:
    pct = (count_g1or2_true_g3_false / total_files) * 100
    print(f"That is {pct:.2f}% of all repos.")