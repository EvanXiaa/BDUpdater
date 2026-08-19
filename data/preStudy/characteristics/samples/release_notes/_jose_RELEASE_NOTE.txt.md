```
v5.0.0:
### ⚠ breaking changes

* **node.js:** return uint8array (not a buffer) from base64url.decode
* browser distribution is now built using es2020 as a target
* node.js distribution is now built using es2022 as a target
* **types:** jwtverify and jwtdecrypt type argument for the resolved keylike type is now a second optional type argument following a type for the jwt claims set (aka payload)
* pbes2 key management algorithms' use in decrypt functions now requires the use of the keymanagementalgorithms option to explicitly opt-in for their use.
* importjwk "octaskeyobject" option was removed. importjwk will no longer return cryptokey or keyobject for "oct" (octet sequence) jwk key types, it will instead always return a uint8array formed from the "k" (key value) parameter regardless of the other jwk parameters that may be present.
* end-of-life versions of node.js as of october 2023 are no longer supported. node.js 18, 20, 21, and future releases are the ones that remain supported.
* the jwe "zip" (compression algorithm) header parameter is no longer supported by this jose implementation.

### features

* add date as valid input to timestamp setting functions ([bd830a4](https://github.com/panva/jose/commit/bd830a47979912d4c0775d01a05584c2aa9f0dcd))
* default to an empty payload in jwt producing constructors ([98d6ca1](https://github.com/panva/jose/commit/98d6ca12c448697ed6342b1230b351eb5bfa0df8))
* **types:** add optional generics for jwt verify and decrypt ([61bd2a0](https://github.com/panva/jose/commit/61bd2a0adb638c1c2469459d78556a99cec697c7)), closes [#568](https://github.com/panva/jose/issues/568)


### reverts

* revert "test: fix test under lts/erbium" ([b64b6c7](https://github.com/panva/jose/commit/b64b6c731c3e2d0e6751e0221804af08d7015bfa))


### refactor

* browser distribution is now built using es2020 as a target ([1836684](https://github.com/panva/jose/commit/18366840e1ae557b951fe921c5004b17ad56e972))
* drop support for eol node.js versions ([b5aee54](https://github.com/panva/jose/commit/b5aee542fb5995dd29e012011f832ce8dfd24e29))
* importjwk always returns a uint8array for symmetric key inputs ([163e1b0](https://github.com/panva/jose/commit/163e1b02ed5b64368110d750c9f5f5c3d247042d))
* node.js distribution is now built using es2022 as a target ([239697a](https://github.com/panva/jose/commit/239697a17d048b8eb2120d29adff7f98edc0f26e))
* **node.js:** return uint8array (not a buffer) from base64url.decode ([02d5182](https://github.com/panva/jose/commit/02d51827e24195d650cf83de100ae16cd8b0599e))
* pbes2 algorithms require explicit opt-in during verification ([e2da031](https://github.com/panva/jose/commit/e2da031381b7c5327ea9a0ccf58f059fa8af7e92))
* remove support for jwe "zip" (compression algorithm) header parameter ([16998b1](https://github.com/panva/jose/commit/16998b15c75d90b64eb5b0fa0713cfdfa7896757))
* **types:** rename type parameters for the keylike returns ([eddd400](https://github.com/panva/jose/commit/eddd400235e84e3d84c1a8471b01915a12d3d866))
* update allow list error messages ([fe8114c](https://github.com/panva/jose/commit/fe8114c82646f2468857effb934f39dd7bc75902))

