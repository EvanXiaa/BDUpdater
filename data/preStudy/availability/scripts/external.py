import os
import csv
import requests
from urllib.parse import urlparse


INPUT_CSV = ""
BASE_OUTPUT_DIR = ""


REPO_URL_COLUMN = "repo_url"
EXTERNAL_COLUMN = "external"


def get_repo_from_url(url):
    try:
        parsed = urlparse(url)
        parts = parsed.path.strip("/").split("/")
        if len(parts) >= 2:
            return f"{parts[0]}/{parts[1].replace('.git', '')}"
    except Exception:
        pass
    return None


def sanitize_filename(name):
    return name.replace(":", "").replace("/", "_").replace("?", "_")


def fetch_and_save_html(url, output_path):
    try:
        print(f"  🌐 Fetching: {url}")
        response = requests.get(url, timeout=20)
        response.raise_for_status()
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(response.text)
        print(f"    ✅ Saved: {output_path}")
    except Exception as e:
        print(f"    ❌ Failed to fetch {url}: {e}")


def build_and_fetch(csv_path, output_base_dir):
    triple_set = set()
    seen_external_sets = set()

    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            repo_url = row.get(REPO_URL_COLUMN, "").strip()
            external_raw = row.get(EXTERNAL_COLUMN, "").strip()

            if not repo_url or not external_raw:
                continue

            external_urls = sorted(set(
                url.strip() for url in external_raw.split(";") if url.strip()
            ))
            if not external_urls:
                continue

            external_key = tuple(external_urls)
            if external_key in seen_external_sets:
                continue

            repo = get_repo_from_url(repo_url)
            if not repo:
                continue

            # Store this triple and mark external set as seen
            triple_set.add((repo, repo_url, external_key))
            seen_external_sets.add(external_key)

            # Fetch HTML for each external URL
            owner, repo_name = repo.split("/", 1)
            repo_output_dir = os.path.join(output_base_dir, owner, repo_name)
            os.makedirs(repo_output_dir, exist_ok=True)

            for i, ext_url in enumerate(external_urls):
                html_filename = f"external_{i+1}.html"
                html_path = os.path.join(repo_output_dir, sanitize_filename(html_filename))
                fetch_and_save_html(ext_url, html_path)


def main():
    print(f"🔍 Reading CSV: {INPUT_CSV}")
    build_and_fetch(INPUT_CSV, BASE_OUTPUT_DIR)
    print("\n✅ Done fetching all external HTML.")


if __name__ == "__main__":
    main()