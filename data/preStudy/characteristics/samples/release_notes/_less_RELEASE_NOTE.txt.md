v4.0.0
This release has 2 breaking changes:

### Parentheses required for mixin calls

This aligns it with syntax for calling detached rulesets.

Example
```less
.mixin() {}
.mixin;  // error in 4.0
```

### Parens-division now the default math setting

Parentheses are required (by default) around division-like expressions, to force math evaluation.

Example:
```less
@ratio_large: 16;
@ratio_small: 9;

/** The following will produce `device-aspect-ratio: 1.77777778` by default in 3.x */
@media all and (device-aspect-ratio: @ratio_large / @ratio_small) {
   .body { max-width: 800px; }
}
```
Produces:
```css
@media all and (device-aspect-ratio: 16 / 9) {
  .body {
    max-width: 800px;
  }
}
```
You can, of course, get old math behavior. See: http://lesscss.org/usage/#less-options-math


### What's New

* min() / max() functions can pass-through if it cannot be evaluated in Less
* isdefined() can be used to test if variables are defined (e.g. `isdefined(@unknown)`)
* New rgb color syntax supported (e.g. `rgb(0 128 255 / 50%)`)
