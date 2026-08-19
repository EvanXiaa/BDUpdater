3.0.0
### Breaking
- Rework and simplify `targets` option. It accepts an array of objects as targets
- Remove `outputFolder` option. Use target's `dest` property instead
- Remove useless `warnOnNonExist` option

### New features
- Add glob support
- Add copy once feature, useful in watch mode
- Add typescript types

### Other
- Update messages
- Update dependencies