v7.0.0
Breaking changes:

* Adopt type: module. #3501  
* Adopt [InternMap](https://github.com/mbostock/internmap) for [ordinal scale domains](https://github.com/d3/d3-scale/blob/main/README.md#ordinal-scales).
* [d3.ascending](https://github.com/d3/d3-array/blob/main/README.md#ascending) and [d3.descending](https://github.com/d3/d3-array/blob/main/README.md#descending) no longer consider null comparable.
* [d3.bin](https://github.com/d3/d3-array/blob/main/README.md#bin) now ignores nulls.
* Convert array-likes (e.g., live NodeList) to arrays in [d3.selectAll](https://github.com/d3/d3-selection/blob/main/README.md#selectAll) and [*selection*.selectAll](https://github.com/d3/d3-selection/blob/main/README.md#selection_selectAll).

Non-breaking changes:

* Add [d3.mode](https://github.com/d3/d3-array/blob/main/README.md#mode).
* Add [d3.flatGroup](https://github.com/d3/d3-array/blob/main/README.md#flatGroup) and [d3.flatRollup](https://github.com/d3/d3-array/blob/main/README.md#flatRollup).
* Add [*transition*.selectChild](https://github.com/d3/d3-transition/blob/main/README.md#selectChild).
* Add [*transition*.selectChildren](https://github.com/d3/d3-transition/blob/main/README.md#selectChildren).
* Adopt [robust predicates](https://github.com/mourner/robust-predicates) for [Delaunay triangulation](https://github.com/d3/d3-delaunay).
* Fix [*delaunay*.voronoi](https://github.com/d3/d3-delaunay/blob/main/README.md#delaunay_voronoi)’s computed circumcenters for [collinear points on the hull](https://observablehq.com/@fil/d3-delaunay-6-robustly-released).
* Allow [*brush*.move](https://github.com/d3/d3-brush/blob/main/README.md#brush_move) and [*brush*.clear](https://github.com/d3/d3-brush/blob/main/README.md#brush_clear) to take an optional event.
* Allow [*selection*.merge](https://github.com/d3/d3-selection/blob/main/README.md#selection_merge) to take a transition.
* Allow [*selection*.join](https://github.com/d3/d3-selection/blob/main/README.md#selection_join) to take transitions.
* Apply [linear binning](https://observablehq.com/@d3/contourdensity-linear-binning) for [d3.contourDensity](https://github.com/d3/d3-contour/blob/main/README.md#contourDensity).
* Generate [*contours*.thresholds](https://github.com/d3/d3-contour/blob/main/README.md#contours_thresholds) at nicer round tick values.
* Fix [*axis*.tickArguments](https://github.com/d3/d3-axis/blob/main/README.md#axis_tickArguments) to accept an iterable.
* Fix [*axis*.tickValues](https://github.com/d3/d3-axis/blob/main/README.md#axis_tickValues) to accept an iterable.
* Fix undefined *event* during [*brush*.move](https://github.com/d3/d3-brush/blob/main/README.md#brush_move).
* Fix [drag event listeners](https://github.com/d3/d3-drag) to be explicitly non-passive where necessary ([#78](https://github.com/d3/d3-drag/issues/78)).
* Fix [zoom event listeners](https://github.com/d3/d3-zoom) to be explicitly non-passive where necessary.
* Fix variable initialization error in d3-zoom.
* Expose [d3.ZoomTransform](https://github.com/d3/d3-zoom/blob/main/README.md#zoom-transforms) constructor.
* Update dependencies.
* Make build reproducible.

D3 now requires Node.js 12 or higher. For more, please read [Sindre Sorhus’s FAQ](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).