This directory contains the human evaluation results of breaking change facts availability.

`npm_bc_study_full_human_new.csv`: the raw evaluation result
`show_result.py`: use this to present the statistics

```aiignore
✅ Total repos analyzed: 1000
✅ Repos with at least one breaking change doc: 838 (83.80%)

📄 changelog_file: 484 repos (48.40%)
📄 migration_file: 58 repos (5.80%)
📄 readme_breaking_file: 52 repos (5.20%)
📄 other_files: 48 repos (4.80%)
📄 external: 30 repos (3.00%)
✅ In-repo doc: 560 (56.00%)

📄 breaking_change_in_releases: 592 repos (59.20%)
📄 event_exist: 343 repos (34.30%)
```