import json
import os
import shutil,random
import pandas as pd

def pick_random_items(items, n=5):
    if len(items) <= n:
        return items
    return random.sample(items, n)


# Input result CSV
RESULT_FILE = "./npm_bc_study_full_human_new.csv"

def summarize_breaking_change_docs(file_path):
    df = pd.read_csv(file_path)

    # Normalize missing values (empty strings -> NaN)
    df = df.replace('', pd.NA)

    # (1) Repos with at least one breaking change document
    has_any_doc = (
        df[['changelog_file', 'migration_file', 'readme_breaking_file', 'other_files', 'external']].notna().any(axis=1) |
        (df['breaking_change_in_releases'] == True) |
        (df['event_exist'] == True)
    )

    num_repos_with_any_doc = has_any_doc.sum()
    total_repos = len(df)
    percentage_repos_with_any_doc = num_repos_with_any_doc / total_repos * 100

    print(f"✅ Total repos analyzed: {total_repos}")
    print(f"✅ Repos with at least one breaking change doc: {num_repos_with_any_doc} ({percentage_repos_with_any_doc:.2f}%)\n")

    # (2) Percentage for each document type
    for doc_type in ['changelog_file', 'migration_file', 'readme_breaking_file', 'other_files', 'external']:
        exist_count = df[doc_type].notna().sum()
        percentage = exist_count / total_repos * 100
        print(f"📄 {doc_type}: {exist_count} repos ({percentage:.2f}%)")

    has_any_doc = (
        df[['changelog_file', 'migration_file', 'readme_breaking_file', 'other_files']].notna().any(axis=1)
    )
    num_repos_with_any_doc = has_any_doc.sum()
    percentage_repos_with_any_doc = num_repos_with_any_doc / total_repos * 100
    print(f"✅ In-repo doc: {num_repos_with_any_doc} ({percentage_repos_with_any_doc:.2f}%)\n")


    if 'breaking_change_in_releases' in df.columns:
        exist_count = (df['breaking_change_in_releases'] == True).sum()
        percentage = exist_count / total_repos * 100
        print(f"📄 breaking_change_in_releases: {exist_count} repos ({percentage:.2f}%)")

    if 'event_exist' in df.columns:
        exist_count = (df['event_exist'] == True).sum()
        percentage = exist_count / total_repos * 100
        print(f"📄 event_exist: {exist_count} repos ({percentage:.2f}%)")


if __name__ == "__main__":
    summarize_breaking_change_docs(RESULT_FILE)
