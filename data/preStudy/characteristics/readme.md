This directory contains the human evaluation results of breaking change facts characteristics.

`samples`: the raw files for evaluation
`results`: the evaluation result

`show_result.py`: use this to present the statistics

```aiignore
=== Per-Key True Percentages ===
W1: 52.13% (294/564)
W2: 24.11% (136/564)
W3: 43.97% (248/564)
W4: 44.86% (253/564)
W5: 26.24% (148/564)
W6: 21.99% (124/564)
W7-a: 34.57% (195/564)
W7-b: 40.43% (228/564)
W8: 14.89% (84/564)
W9: 57.27% (323/564)
H1-a: 28.37% (160/564)
H1-b: 8.16% (46/564)
H2: 15.60% (88/564)
H3: 24.65% (139/564)
Y1: 40.96% (231/564)

=== Group Existence Percentages ===

Describe Object of Change [W1, W2, W6]
  Any-present: 56.91% (321/564)
  All-present: 10.11% (57/564)
  Avg coverage across repos: 32.74%

Describe characteristics of Change [W3, W4, W5, W9]
  Any-present: 82.62% (466/564)
  All-present: 8.69% (49/564)
  Avg coverage across repos: 43.09%

Describe Environment/Dependency Change [W7-a, W7-b]
  Any-present: 55.14% (311/564)
  All-present: 19.86% (112/564)
  Avg coverage across repos: 37.50%

Describe Downstream Adaptation [H1-a, H1-b, H2, H3]
  Any-present: 44.68% (252/564)
  All-present: 3.37% (19/564)
  Avg coverage across repos: 19.19%

Describe Implicit Changes [W8]
  Any-present: 14.89% (84/564)
  All-present: 14.89% (84/564)
  Avg coverage across repos: 14.89%

Number of repos with 'Describe characteristics of Change' TRUE and 'Describe Object of Change' FALSE: 149/564
That is 26.42% of all repos.

Number of repos with (Describe characteristics of Change OR Describe Object of Change) TRUE and Describe Downstream Adaptation FALSE: 236/564
That is 41.84% of all repos.
```