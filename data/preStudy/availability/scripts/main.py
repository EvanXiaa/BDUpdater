import os
import requests
import shutil
import zipfile
import re,csv
from urllib.parse import urlparse
import time

# --- Configuration ---
GITHUB_API_URL = "https://api.github.com"

# OPTIONAL: Set your GitHub Personal Access Token here or as an environment variable
# For higher rate limits and access to private repositories.
# If using an environment variable: GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_TOKEN = ""  # <--- REPLACE WITH YOUR VALID TOKEN or use ENV

# List of GitHub repository URLs to process
REPO_URLS = [
    "https://github.com/caolan/async/"
]

# List of keywords to search for in local files
FILE_KEYWORDS = [
    "breaking",
    "major",
    "remove",
    "rename",
    "move",
    "inline",
    "deprecate",
    "replace",
    "backward-incompatible",
    "drop",
    "migrate",
    "refactor"
]

# List of keywords to search for in Pull Request / Commit messages (general search)
VC_KEYWORDS = [  # Version Control Keywords
    "BREAKING CHANGE:",
]


# --- Helper Functions ---

def get_repo_owner_and_name(url):
    """Extracts owner and repository name from a GitHub URL."""
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip("/").split("/")
    if len(path_parts) >= 2:
        return path_parts[0], path_parts[1].replace('.git', '')
    print(f"Warning: Could not parse owner/repo from URL: {url}")
    return None, None


def make_github_api_request(url, params=None, stream=False, headers=None):
    """Makes a request to the GitHub API with authentication and error handling."""
    if headers is None:
        headers = {}

    base_headers = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    if GITHUB_TOKEN and GITHUB_TOKEN != "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN_HERE" and GITHUB_TOKEN != '':  # Avoid using placeholder in actual requests if it was not replaced
        base_headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    headers.update(base_headers)

    try:
        response = requests.get(url, headers=headers, params=params, timeout=30, stream=stream)
        if 'X-RateLimit-Remaining' in response.headers and int(response.headers['X-RateLimit-Remaining']) < 10:
            reset_time = int(response.headers.get('X-RateLimit-Reset', time.time() + 60))
            wait_seconds = max(0, reset_time - time.time()) + 5
            print(
                f"Rate limit low ({response.headers['X-RateLimit-Remaining']}). Waiting for {wait_seconds:.0f} seconds...")
            time.sleep(wait_seconds)

        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error making API request to {url}: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response status: {e.response.status_code}")
            print(f"Response content: {e.response.text[:200]}...")
        return None


def get_paginated_data(url, params=None):
    """Fetches all items from a paginated GitHub API endpoint."""
    results = []
    page_url = url
    is_search_api = "/search/" in page_url  # Search API has 'items' key

    # Params should only be sent with the initial request if not already in page_url
    initial_params = params

    while page_url:
        print(f"  Fetching page: {page_url.split('?')[0]}...")
        response = make_github_api_request(page_url, params=initial_params)
        initial_params = None  # Params are included in 'next' link

        if not response:
            print(f"    Failed to fetch data from {page_url}.")
            break

        try:
            current_data = response.json()
        except requests.exceptions.JSONDecodeError:
            print(f"    Failed to decode JSON from {page_url}.")
            break

        if is_search_api:
            if isinstance(current_data, dict) and 'items' in current_data:
                results.extend(current_data['items'])
            else:
                print(
                    f"    Warning: Unexpected data format from search API {page_url}. Expected 'items' key. Got: {list(current_data.keys()) if isinstance(current_data, dict) else type(current_data)}")
                break
        else:  # Not a search API like /labels or /issues (non-search)
            if isinstance(current_data, list):
                results.extend(current_data)
            else:
                print(
                    f"    Warning: Unexpected data format from {page_url}. Expected a list. Got: {type(current_data)}")
                break

        if 'Link' in response.headers:
            links = response.headers['Link']
            next_link = None
            for link_part in links.split(','):
                if 'rel="next"' in link_part:
                    next_link = link_part.split(';')[0].strip('<>')
                    break
            page_url = next_link
        else:
            page_url = None
    return results


def get_download_info(owner, repo):
    """Determines the best version to download (release, tag, or branch)."""
    print(f"\nDetermining download source for {owner}/{repo}...")
    # 1. Try to get the latest release
    api_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/releases/latest"
    response = make_github_api_request(api_url)
    if response:
        try:
            release_data = response.json()
            if "tag_name" in release_data and "zipball_url" in release_data:
                print(f"  Found latest release: {release_data['tag_name']}")
                return "release", release_data['tag_name'], release_data['zipball_url']
        except requests.exceptions.JSONDecodeError:
            print(f"  Could not decode JSON for latest release from {api_url}")

    # 2. If no release, try to get the most recent tag
    api_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/tags"
    # Tags are typically paginated, but we only need the first few to find the "latest"
    # For simplicity, get_paginated_data will fetch all, but we'll use the first.
    # A more optimized way would be to fetch just one page.
    tags_data = get_paginated_data(api_url, params={"per_page": 5})  # Get a few, assume newest is first
    if tags_data and isinstance(tags_data, list) and len(tags_data) > 0:
        latest_tag = tags_data[0]
        if "name" in latest_tag and "zipball_url" in latest_tag:
            print(f"  Found latest tag: {latest_tag['name']}")
            return "tag", latest_tag['name'], latest_tag['zipball_url']

    # 3. If no tags or releases, get the default branch
    api_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}"
    response = make_github_api_request(api_url)
    if response:
        try:
            repo_data = response.json()
            if "default_branch" in repo_data:
                default_branch = repo_data["default_branch"]
                zipball_url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/zipball/{default_branch}"
                print(f"  Using default branch: {default_branch}")
                return "branch", default_branch, zipball_url
        except requests.exceptions.JSONDecodeError:
            print(f"  Could not decode JSON for repo info from {api_url}")

    print(f"  Could not determine download information for {owner}/{repo}.")
    return None, None, None


def sanitize_for_path(name):
    if not name: return "unknown_version"
    name = re.sub(r'[<>:"/\\|?*]', '_', name)
    name = name.replace(' ', '_')
    return name


def download_and_extract_repo(zip_url, download_base_dir, versioned_repo_identifier):
    """
    Downloads and extracts the repository zip archive.
    If already downloaded for this specific versioned_repo_identifier, returns the path.
    """
    if not zip_url:
        print(f"  ({versioned_repo_identifier}) No zip_url provided for download.")
        return None

    repo_version_specific_dir = os.path.join(download_base_dir, versioned_repo_identifier)
    extraction_target_path = os.path.join(repo_version_specific_dir, "source")
    potential_actual_source_path = None

    if os.path.isdir(extraction_target_path):
        extracted_items = os.listdir(extraction_target_path)
        if extracted_items:
            if len(extracted_items) == 1 and os.path.isdir(os.path.join(extraction_target_path, extracted_items[0])):
                candidate_path = os.path.join(extraction_target_path, extracted_items[0])
                if os.path.isdir(candidate_path) and os.listdir(candidate_path):
                    potential_actual_source_path = candidate_path
            elif any(os.path.isfile(os.path.join(extraction_target_path, item)) for item in extracted_items):
                potential_actual_source_path = extraction_target_path

            if potential_actual_source_path:
                print(
                    f"  Repository ({versioned_repo_identifier}) already downloaded. Path: {potential_actual_source_path}")
                return potential_actual_source_path
            else:
                print(
                    f"  ({versioned_repo_identifier}) Found existing 'source' directory, but content structure is unexpected. Cleaning and re-downloading.")
                shutil.rmtree(extraction_target_path)
        else:
            print(f"  ({versioned_repo_identifier}) Found empty 'source' directory. Will re-download.")
            shutil.rmtree(extraction_target_path)

    print(f"  ({versioned_repo_identifier}) Preparing to download...")
    os.makedirs(repo_version_specific_dir, exist_ok=True)
    os.makedirs(extraction_target_path, exist_ok=True)
    local_zip_path = os.path.join(repo_version_specific_dir, "repo.zip")

    try:
        print(f"  ({versioned_repo_identifier}) Downloading from {zip_url}...")
        response = make_github_api_request(zip_url, stream=True)
        if not response: return None

        with open(local_zip_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192): f.write(chunk)

        print(f"  ({versioned_repo_identifier}) Download complete. Extracting...")
        with zipfile.ZipFile(local_zip_path, 'r') as zip_ref:
            zip_ref.extractall(extraction_target_path)

        extracted_items = os.listdir(extraction_target_path)
        actual_source_path = None
        if len(extracted_items) == 1 and os.path.isdir(os.path.join(extraction_target_path, extracted_items[0])):
            actual_source_path = os.path.join(extraction_target_path, extracted_items[0])
        elif any(os.path.isfile(os.path.join(extraction_target_path, item)) for item in extracted_items):
            actual_source_path = extraction_target_path

        if actual_source_path and os.path.isdir(actual_source_path):
            print(f"  ({versioned_repo_identifier}) Extracted to: {actual_source_path}")
            return actual_source_path
        else:
            print(
                f"  ({versioned_repo_identifier}) Extraction resulted in an unexpected structure in {extraction_target_path}.")
            if os.path.exists(extraction_target_path): shutil.rmtree(extraction_target_path)
            return None
    except Exception as e:
        print(f"  An error occurred during download/extraction for {versioned_repo_identifier}: {e}")
        if os.path.exists(extraction_target_path): shutil.rmtree(extraction_target_path)
        return None
    finally:
        if os.path.exists(local_zip_path): os.remove(local_zip_path)


def search_files_in_directory(directory_path, keywords_list):
    """Recursively searches for keywords in files within a directory."""
    found_files_details = {}
    if not directory_path or not os.path.isdir(directory_path):
        print(f"  Directory {directory_path} does not exist for searching local files.")
        return found_files_details

    print(f"  Searching local files for keywords: {', '.join(keywords_list)} in {directory_path}")
    keyword_patterns = [re.compile(re.escape(kw), re.IGNORECASE) for kw in keywords_list]
    non_binary_extensions = {".md",".txt"}
    for root, _, files in os.walk(directory_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if os.path.splitext(file_name.lower())[1] not in non_binary_extensions:
                continue
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()  # Read whole file for simplicity here
                    matched_keywords_in_file = set()
                    for i, pattern in enumerate(keyword_patterns):
                        if pattern.search(content):
                            matched_keywords_in_file.add(keywords_list[i])
                    if matched_keywords_in_file:
                        relative_path = os.path.relpath(file_path, directory_path)
                        found_files_details[relative_path] = sorted(list(matched_keywords_in_file))
            except Exception:
                pass  # Silently skip files that can't be read/processed
    return found_files_details


def search_github_items(owner, repo, item_type, keywords_list):
    """Searches GitHub commits or pull requests (issues) via API for general VC_KEYWORDS."""
    print(f"\n  Performing general search for {item_type} with keywords: {', '.join(keywords_list)}")
    results = []
    if not keywords_list: return results

    query_keywords_part = " OR ".join([f'"{k}"' for k in keywords_list])  # Search for any keyword
    base_query = f"repo:{owner}/{repo} {query_keywords_part}"
    params = {"per_page": 20, "sort": "updated", "order": "desc"}  # Limit results for this general search

    if item_type == "pull_requests":
        api_url = f"{GITHUB_API_URL}/search/issues"
        params["q"] = f"{base_query} is:pr in:title,body,comments"  # Search in various fields
    elif item_type == "commits":
        api_url = f"{GITHUB_API_URL}/search/commits"
        # For commits, the query usually targets the commit message by default.
        params["q"] = base_query
    else:
        return []

    # Using get_paginated_data for search which expects 'items'
    items_data = get_paginated_data(api_url, params=params)

    for item_data in items_data:
        if item_type == "pull_requests":
            item_type_label = "Pull Request" if item_data.get(
                'pull_request') else "Issue"  # Should always be PR due to "is:pr"
            results.append({
                "type": item_type_label,
                "number": item_data.get("number"),
                "title": item_data.get("title"),
                "url": item_data.get("html_url"),
                "state": item_data.get("state"),
                "user": item_data.get("user", {}).get("login")
            })
        elif item_type == "commits":
            commit_info = item_data.get("commit", {})
            author_info = commit_info.get("author", {})
            results.append({
                "type": "Commit",
                "message": commit_info.get("message", "").split('\n')[0],
                "url": item_data.get("html_url"),
                "committer": author_info.get("name"),
                "date": author_info.get("date")
            })
    return results


# --- Functions for "Breaking Change" Label/Title Analysis (Integrated) ---
def get_all_repo_labels(owner, repo):
    """Fetches all labels for a given repository."""
    print(f"\n  Fetching all labels for {owner}/{repo} (for breaking change analysis)...")
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/labels"
    labels_data = get_paginated_data(url, params={"per_page": 100})
    return [label['name'] for label in labels_data if 'name' in label]


def get_items_by_specific_label(owner, repo, label_name):
    """Fetches issues and pull requests for a given specific label name."""
    print(f"  Fetching items for specific label '{label_name}' in {owner}/{repo}...")
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/issues"
    params = {"labels": label_name, "state": "all", "per_page": 100}
    items_data = get_paginated_data(url, params=params)

    processed_items = []
    for item_data in items_data:
        item_type = "Pull Request" if "pull_request" in item_data else "Issue"
        if item_type == "Issue":
            continue
        processed_items.append({
            "type": item_type,
            "number": item_data.get("number"),
            "title": item_data.get("title"),
            "url": item_data.get("html_url"),
            "state": item_data.get("state"),
            "labels": [label['name'] for label in item_data.get("labels", []) if
                       isinstance(label, dict) and 'name' in label]
        })
    return processed_items


def search_items_by_specific_title(owner, repo, title_keywords):
    """Searches for issues and pull requests with specific keywords in their title."""
    print(f"  Searching for items with title containing '{title_keywords}' in {owner}/{repo}...")
    query = f'repo:{owner}/{repo} "{title_keywords}" in:title'
    query += " is:pr"
    url = f"{GITHUB_API_URL}/search/issues"
    params = {"q": query, "per_page": 100, "sort": "updated", "order": "desc"}
    items_data = get_paginated_data(url, params=params)

    processed_items = []
    for item_data in items_data:
        item_type = "Pull Request" if item_data.get('pull_request') else "Issue"
        if item_type == "Issue":
            continue
        processed_items.append({
            "type": item_type,
            "number": item_data.get("number"),
            "title": item_data.get("title"),
            "url": item_data.get("html_url"),
            "state": item_data.get("state"),
            "labels": [label['name'] for label in item_data.get("labels", []) if
                       isinstance(label, dict) and 'name' in label]
        })
    return processed_items


# --- Main Script Logic ---
def main():
    INPUT_CSV_FILENAME = ""
    OUTPUT_CSV_FILENAME = ""
    if not os.path.exists(INPUT_CSV_FILENAME):
        print(f"Error: Input CSV file '{INPUT_CSV_FILENAME}' not found.")
        return

    temp_download_root = "temp_repo_downloads"
    if not os.path.exists(temp_download_root):
        os.makedirs(temp_download_root)

    updated_rows = []
    fieldnames = []

    try:
        with open(INPUT_CSV_FILENAME, mode='r', encoding='utf-8', newline='') as infile:
            reader = csv.DictReader(infile)
            fieldnames = reader.fieldnames
            CSV_REPO_URL_COLUMN = "repo_url"
            if CSV_REPO_URL_COLUMN not in fieldnames:
                print(f"Error: Column '{CSV_REPO_URL_COLUMN}' not found in input CSV header: {fieldnames}")
                return

            # Add new columns to fieldnames if they don't exist
            new_columns = ["other files", "event_exist"]
            for col in new_columns:
                if col not in fieldnames:
                    fieldnames.append(col)

            for i, row in enumerate(reader):
                if i > 18:
                    continue
                repo_url = row.get(CSV_REPO_URL_COLUMN, "").strip()
                print(f"\n--- Processing Repository {i + 1}: {repo_url} (from CSV) ---")

                if not repo_url:
                    print("  Skipping row due to empty repository URL.")
                    row["other files"] = ""
                    row["event_exist"] = False
                    updated_rows.append(row)
                    continue

                owner, repo_name = get_repo_owner_and_name(repo_url)
                if not owner or not repo_name:
                    print(f"  Could not parse owner/repo from URL: {repo_url}. Skipping.")
                    row["other files"] = ""
                    row["event_exist"] = False
                    # Add error message to row if desired, e.g., row["processing_error"] = "Invalid URL"
                    updated_rows.append(row)
                    continue

                # Initialize results for this repo
                local_files_found_paths = []
                pulls_with_vc_keywords_exist = False

                # 1. Get download info & Download
                source_type, source_name, zip_url = get_download_info(owner, repo_name)
                extracted_repo_path = None
                if source_type and source_name and zip_url:
                    versioned_identifier = f"{owner}_{repo_name}_{sanitize_for_path(source_name)}"
                    extracted_repo_path = download_and_extract_repo(zip_url, temp_download_root, versioned_identifier)

                # 2. Search files locally if download was successful
                if extracted_repo_path:
                    local_files_found_paths = search_files_in_directory(extracted_repo_path, FILE_KEYWORDS)
                print(local_files_found_paths)
                row["other files"] = ";".join(local_files_found_paths) if local_files_found_paths else ""

                # 3. General PR Search using VC_KEYWORDS to determine "event_exist"
                #    This specifically targets PRs with VC_KEYWORDS.
                all_repo_labels = get_all_repo_labels(owner, repo_name)

                breaking_label_keyword = "breaking"  # Case-insensitive
                found_specific_breaking_labels = []
                if all_repo_labels:  # Ensure labels were fetched
                    for label in all_repo_labels:
                        if breaking_label_keyword.lower() in label.lower():
                            found_specific_breaking_labels.append(label)
                        if "major" in label.lower():
                            found_specific_breaking_labels.append(label)
                            print("major", label)

                breaking_analysis_items = []
                breaking_search_method = "N/A"

                if found_specific_breaking_labels:
                    breaking_search_method = f"Label(s) containing '{breaking_label_keyword}': {', '.join(found_specific_breaking_labels)}"
                    # print(f"  Found label(s) matching criteria: {', '.join(found_specific_breaking_labels)}")
                    # for bl_name in found_specific_breaking_labels:
                    #     items_from_label = get_items_by_specific_label(owner, repo_name, bl_name)
                    #     for item in items_from_label:
                    #         item['found_by_specific_analysis'] = f"Label: {bl_name}"
                    #         if not any(r_item['url'] == item['url'] for r_item in
                    #                    breaking_analysis_items):  # Avoid duplicates
                    #             breaking_analysis_items.append(item)
                    row["event_exist"] = True
                else:
                    title_search_keyword = "Breaking Change:"  # Case-insensitive handled by GitHub search usually
                    breaking_search_method = f"Title search for '{title_search_keyword}' (no 'breaking' labels found)"
                    print(
                        f"  No labels found containing '{breaking_label_keyword}'. Searching titles for '{title_search_keyword}'...")
                    items_from_title_search = search_items_by_specific_title(owner, repo_name, title_search_keyword)
                    if len(items_from_title_search) > 0:
                        row["event_exist"] = True
                    # for item in items_from_title_search:
                    #     item['found_by_specific_analysis'] = f"Title Search: '{title_search_keyword}'"
                    #     breaking_analysis_items.append(item)

                updated_rows.append(row)
                print(
                    f"  Finished processing {repo_url}. Other files found: {len(local_files_found_paths)}. Pulls with VC_KEYWORDS exist: {pulls_with_vc_keywords_exist}")
                time.sleep(1)  # Small delay between repos

    except FileNotFoundError:
        print(f"Error: Input CSV file '{INPUT_CSV_FILENAME}' not found.")
        return
    except Exception as e:
        print(f"An error occurred during CSV processing or main loop: {e}")
        import traceback
        traceback.print_exc()
        return  # Stop if there's a major error in CSV reading

    # --- Write updated data to a new CSV file ---
    if updated_rows:
        try:
            with open(OUTPUT_CSV_FILENAME, mode='w', encoding='utf-8', newline='') as outfile:
                writer = csv.DictWriter(outfile, fieldnames=fieldnames,
                                        extrasaction='ignore')  # extrasaction='ignore' is safer
                writer.writeheader()
                writer.writerows(updated_rows)
            print(f"\nSuccessfully processed {len(updated_rows)} rows. Output written to '{OUTPUT_CSV_FILENAME}'")
        except Exception as e:
            print(f"Error writing output CSV file: {e}")
    else:
        print("No data processed or to write to output CSV.")

    # --- Cleanup ---
    # Consider making cleanup optional if cache is desired across runs
    # cleanup_temp = input("Clean up temporary download directory? (yes/no): ").lower()
    # if cleanup_temp == 'yes':
    # try:
    #     print(f"\nCleaning up temporary download directory: {temp_download_root}...")
    #     if os.path.exists(temp_download_root):
    #         shutil.rmtree(temp_download_root)
    #     print("Cleanup complete.")
    # except Exception as e:
    #     print(f"Error during cleanup of {temp_download_root}: {e}")


if __name__ == "__main__":
    start_time = time.time()
    main()
    end_time = time.time()
    print(f"\nScript finished in {end_time - start_time:.2f} seconds.")