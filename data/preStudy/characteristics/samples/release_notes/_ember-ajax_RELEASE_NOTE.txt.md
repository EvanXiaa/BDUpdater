v4.0.0
## What happened?

There was a bug fixed in `v3.1.1` that resulted in a "breaking change" for many users. This bug was related to the fact that `ember-ajax` previously always made relative URLs into absolute URLs. I didn't correctly think about the fact that this would break people that depended on this behavior, and released the change within a "patch" release.

#383 and the resulting conversation was the outcome of this error on my (@alexlafroscia's) part.

## Going forward

Two releases were made to attempt to address this fact.

- `v3.1.3` was released that reverts the new behavior. If you were banking on your relative URLs being made absolute implicitly, please upgrade to that version.
- `v4.0.0` was released from `master`, including no new behavior from `v3.1.2`. This means that, if you've already upgraded to `v3.1.1` or later, you can safely move to `v4.0.0` without changing any code on your end.

I'm sorry for whatever frustration this issue caused and appreciate the assistance of those that brought the issue to my attention.