v15.0.0
Major release introducing support for visionOS :tada:, some bug fixes and a BREAKING CHANGE due to https://github.com/software-mansion/react-native-svg/pull/2232. If your app already supports `iOS` >= `12.4` then you can safely upgrade the version, otherwise, you have to bump it first.

## What's Changed
* feat: add visionOS support by @okwasniewski in https://github.com/software-mansion/react-native-svg/pull/2190
* fix: Correct types for transformsArrayToProps by @crazyfraggle in https://github.com/software-mansion/react-native-svg/pull/2193
* chore: bump examples to 0.73.1 by @WoLewicki in https://github.com/software-mansion/react-native-svg/pull/2201
* Fix type exports and enable `isolatedModules` setting to catch it in `tsc` by @renchap in https://github.com/software-mansion/react-native-svg/pull/2197
* Fix crash when SVG is unloaded by XAML by @rozele in https://github.com/software-mansion/react-native-svg/pull/2195
* fix(SvgCssUri): support rendering fallback instead of crashing the app when loading invalid content from remote svg file by @quangkcao in https://github.com/software-mansion/react-native-svg/pull/2196
* fix: Ensure RNSVG.dll is built with proper publisher/versioning information via new resource file. by @taenri in https://github.com/software-mansion/react-native-svg/pull/2191
* Update ios-build-test.yml by @WoLewicki in https://github.com/software-mansion/react-native-svg/pull/2207
* fix: visionOS support by @tomekzaw in https://github.com/software-mansion/react-native-svg/pull/2218
* fixed @Deprecated warning in React Native 0.73: 'com.facebook.react.common.StandardCharsets' is deprecated and marked for removal by @coder-xiaomo in https://github.com/software-mansion/react-native-svg/pull/2208
* fix: typo on require statement (`WithLocalSvg`) by @voidsatisfaction in https://github.com/software-mansion/react-native-svg/pull/2223
* fix: Add missing nan value checks for bounds size by @MatiPl01 in https://github.com/software-mansion/react-native-svg/pull/2220
* chore(deps): bump ip from 1.1.8 to 1.1.9 in /Example by @dependabot in https://github.com/software-mansion/react-native-svg/pull/2228
* feat: bump minimal ios version to 12.4 by @WoLewicki in https://github.com/software-mansion/react-native-svg/pull/2232

## New Contributors
* @okwasniewski made their first contribution in https://github.com/software-mansion/react-native-svg/pull/2190
* @crazyfraggle made their first contribution in https://github.com/software-mansion/react-native-svg/pull/2193
* @quangkcao made their first contribution in https://github.com/software-mansion/react-native-svg/pull/2196
* @taenri made their first contribution in https://github.com/software-mansion/react-native-svg/pull/2191
* @coder-xiaomo made their first contribution in https://github.com/software-mansion/react-native-svg/pull/2208
* @voidsatisfaction made their first contribution in https://github.com/software-mansion/react-native-svg/pull/2223
* @MatiPl01 made their first contribution in https://github.com/software-mansion/react-native-svg/pull/2220

**Full Changelog**: https://github.com/software-mansion/react-native-svg/compare/v14.1.0...v15.0.0