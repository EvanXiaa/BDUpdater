v4.0.0-beta.3:
### breaking changes

as mentioned in [our beta 2 release](http://blog.getbootstrap.com/2017/10/19/bootstrap-4-beta-2/), we needed to make a few more breaking changes in beta 3. we've summarized them here and in our [migration docs](https://getbootstrap.com/docs/4.0/migration/#beta-3-changes)—be sure to read them!

- **rewrote native and custom check controls.** both browser default and custom checkboxes and radios now have simpler markup after removing the `<input>` from the `<label>`. now, all checkboxes and radios have a parent `<div>` and sibling `<input>` and `<label>` pair. this is essential for form validation and disabled inputs because we can use the input's state to style the label.

	in addition, custom checkbox and radio elements no longer have a `.custom-control-indicator`. this is generated from the new `.custom-control-label`.

- **input groups were rewritten** with specific `.input-group-{prepend|append}` classes. the new approach allows us to support validation styles and messages within input groups, while also adding support for custom selects, custom file inputs, and multiple `.form-control`s.

- **responsive tables are once again parent classes** to avoid accessiblity issues with changing a `<table>`'s `display`.

- **deleted the `.col-form-legend` class**, consolidating it's styles into the `.col-form-label` class.

read the [migration page](https://getbootstrap.com/docs/4.0/migration/#beta-3-changes) for further details.

### more highlights

in addition to the breaking changes, we've addressed a few more general issues that may impact your project.

- restored `cursor: pointer` to non-disabled links, buttons, `.close`, navbar toggler, and pagination links.

- added a new vertically centered modal option with `.modal-dialog-centered`.

- added new dropleft and dropright variants for dropdowns in #23860.

- our npm package no longer includes any files other than our source and dist javascript and css files. if you previously relied on our running our scripts via the `node_modules` folder, you'll need to update your build tools.

- print styles have moved to bottom of the import stack to properly override styles.

for more details on this release's changes, take a look at the [beta 3 ship list issue](https://github.com/twbs/bootstrap/issues/24439), as well as the [beta 3 project](https://github.com/twbs/bootstrap/projects/10).
