v5.0.0 (2025-05-07)
[!NOTE] See the upgrading to v5 guide for a complete list of all API changes in version 5.

[BREAKING] Remove the deprecated onFID() function (#519)
[BREAKING] Change browser support policy to Baseline Widely available (#525)
[BREAKING] Sort the classes that appear in attribution selectors to reduce cardinality (#518)
Extend INP attribution with extra LoAF information: longest script and buckets (#592)
Add support for generating custom targets in the attribution build (#585)
Support multiple calls to onINP() with different config options (#583)
Use visibility-state performance entries (#612)
Ensure idle callbacks don't run twice (#541) and (#548)
Cap nextPaintTime at processingStart (#540) and (#546)
Cap INP breakdowns to INP duration (#528)
Cap LCP load duration to LCP time (#527)