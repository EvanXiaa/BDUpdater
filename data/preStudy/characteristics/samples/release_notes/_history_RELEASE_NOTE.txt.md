v5.0.0-beta.0
[You can track v5 beta progress in #751](https://github.com/ReactTraining/history/pull/751)

You can install the v5 beta using the `next` tag: `npm add history@next`

Lots of updates in this release! Here's a quick summary:

New features:

- Remove legacy browser support (pre pushState)
- Add state to hash history
- Use custom window when creating history objects
- Better history.block API w/ tx.retry for retrying transitions
- Fix location.pathname encoding issues
- About 50% smaller
- No dependencies

Removed features:

- Removes basename support
- Removes relative pathname support in hash + memory histories
- Removes getUserConfirmation
- Removes keyLength
- Removes hashType

Breaking Changes
- Removed support for browsers that do not support the HTML5 history API (no pushState)
- Removed relative pathname support in hash history and memory history
- Removed getUserConfirmation, keyLength, and hashType APIs

A migration guide will be available soon. For now, you can either browse around [the docs on the `dev` branch](https://github.com/ReactTraining/history/tree/dev/docs) or [the tests](https://github.com/ReactTraining/history/tree/dev/modules/__tests__).

Enjoy!