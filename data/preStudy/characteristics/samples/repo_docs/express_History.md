5.0.0-alpha.1 / 2014-11-06
==========================

  * remove:
    - `app.del` - use `app.delete`
    - `req.acceptsCharset` - use `req.acceptsCharsets`
    - `req.acceptsEncoding` - use `req.acceptsEncodings`
    - `req.acceptsLanguage` - use `req.acceptsLanguages`
    - `res.json(obj, status)` signature - use `res.json(status, obj)`
    - `res.jsonp(obj, status)` signature - use `res.jsonp(status, obj)`
    - `res.send(body, status)` signature - use `res.send(status, body)`
    - `res.send(status)` signature - use `res.sendStatus(status)`
    - `res.sendfile` - use `res.sendFile` instead
    - `express.query` middleware
  * change:
    - `req.host` now returns host (`hostname:port`) - use `req.hostname` for only hostname
    - `req.query` is now a getter instead of a plain property
  * add:
    - `app.router` is a reference to the base router