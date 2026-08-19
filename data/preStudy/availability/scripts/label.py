import os
import csv
import json
import time
import requests
from urllib.parse import urlparse

GITHUB_API_URL = "https://api.github.com"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
OUTPUT_BASE_DIR = ""
INPUT_CSV_PATH = ""

BREAKING_LABEL_KEYWORDS = ["breaking", "major"]
TITLE_KEYWORD = "Breaking Change:"  # fallback search keyword


def get_repo_owner_and_name(url):
    parsed = urlparse(url)
    parts = parsed.path.strip("/").split("/")
    if len(parts) >= 2:
        return parts[0], parts[1].replace(".git", "")
    return None, None


def github_api_request(url, params=None):
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"Bearer {GITHUB_TOKEN}"
    }
    try:
        res = requests.get(url, headers=headers, params=params)
        res.raise_for_status()
        return res.json()
    except requests.RequestException as e:
        print(f"GitHub API error for {url}: {e}")
        return None


def get_all_labels(owner, repo):
    labels = []
    page = 1
    while True:
        url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/labels"
        data = github_api_request(url, {"per_page": 100, "page": page})
        if not data:
            break
        labels.extend(data)
        if len(data) < 100:
            break
        page += 1
    return [label["name"] for label in labels]


def find_matching_labels(labels):
    return [l for l in labels if any(kw in l.lower() for kw in BREAKING_LABEL_KEYWORDS)]


def fetch_closed_merged_prs_with_label(owner, repo, label):
    results = []
    page = 1
    while True:
        url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/issues"
        params = {"labels": label, "state": "closed", "per_page": 100, "page": page}
        items = github_api_request(url, params)
        if not items:
            break

        for item in items:
            if "pull_request" in item:
                results.append({"number": item["number"], "title": item.get("title", "")})

        if len(items) < 100:
            break
        page += 1
    return results


def search_closed_merged_prs_by_title(owner, repo, keyword):
    query = f'"repo:{owner}/{repo}" "{keyword}" in:title is:pr is:closed'
    url = f"{GITHUB_API_URL}/search/issues"
    params = {"q": query, "per_page": 100}
    results = []

    data = github_api_request(url, params)
    items = data.get("items", []) if data else []

    for item in items:
        if "pull_request" in item:
            results.append({"number": item["number"], "title": item.get("title", "")})

    return results


def save_consolidated_prs(pr_list, owner, repo):
    if not pr_list:
        return
    path = os.path.join(OUTPUT_BASE_DIR, owner, repo)
    os.makedirs(path, exist_ok=True)
    output_file = os.path.join(path, "merged_breaking_prs.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(pr_list, f, indent=2)
    print(f"  ✅ Saved {len(pr_list)} PR(s) to {output_file}")


def process_repository(repo_url):
    owner, repo = get_repo_owner_and_name(repo_url)
    if not owner or not repo:
        print(f"Invalid repo URL: {repo_url}")
        return

    output_file = os.path.join(OUTPUT_BASE_DIR, owner, repo, "merged_breaking_prs.json")
    if os.path.exists(output_file):
        print(f"🔁 Skipping {owner}/{repo} (already processed)")
        return
    time.sleep(2)  # avoid rate limits
    print(f"\n🔍 Processing {owner}/{repo}...")
    labels = get_all_labels(owner, repo)
    matching_labels = find_matching_labels(labels)

    if matching_labels:
        print(f"  Found matching labels: {matching_labels}")
        all_prs = []
        for label in matching_labels:
            prs = fetch_closed_merged_prs_with_label(owner, repo, label)
            all_prs.extend(prs)
    else:
        print(f"  No matching labels. Searching PR titles for '{TITLE_KEYWORD}'...")
        all_prs = search_closed_merged_prs_by_title(owner, repo, TITLE_KEYWORD)

    save_consolidated_prs(all_prs, owner, repo)


def read_repo_urls_from_csv(csv_path):
    repo_urls = []
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = row.get("repo_url") or row.get("url")
            if url:
                repo_urls.append(url.strip())
    return repo_urls


def main():
    repo_urls = read_repo_urls_from_csv(INPUT_CSV_PATH)
    print(f"📦 Total repositories in CSV: {len(repo_urls)}")

    seen = set()
    for i, repo_url in enumerate(repo_urls):
        if i < 568:
            continue
        normalized_url = repo_url.rstrip("/").lower()
        if normalized_url in seen:
            print(f"[{i + 1}] 🔁 Skipping duplicate: {repo_url}")
            continue

        seen.add(normalized_url)
        print(f"[{i + 1}] Processing: {repo_url}")
        process_repository(repo_url)
        # time.sleep(1)  # avoid rate limits


def printNum():
    a = 0
    b = 0
    for dirpath, dirnames, filenames in os.walk(OUTPUT_BASE_DIR):
        for filename in filenames:
            if filename.endswith(".json"):
                a += 1
                b += len(eval(open(os.path.join(dirpath, filename)).read()))
                print(filename)
    print(a, b)


if __name__ == "__main__":
    # main()
    printNum()