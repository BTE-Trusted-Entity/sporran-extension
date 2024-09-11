# Develop, test and deploy

NOTE: This section is intended for internal team members. If you are an external developer, please check this [documentation](./external.md).

## Getting Started

Run the following commands to install dependencies and start developing

```
yarn install
yarn dev
```

## Scripts

- `yarn dev` - run `webpack` in `watch` mode
- `yarn storybook` - runs the Storybook server
- `yarn build` - builds the production-ready unpacked extension
- `yarn package` - packages the built code for upload
- `yarn test -u` - runs Jest + updates test snapshots
- `yarn lint` - runs Stylelint and ESLint
- `yarn prettify` - runs Prettier
- `yarn open-firefox` - opens Sporran in Firefox
- `yarn open-chrome` - opens Sporran in Chrome

## Testing in browser

### Getting the _internal_ version of extension

1. Go to [actions page for "Packages the internal version"](https://github.com/KILTprotocol/sporran-extension/actions/workflows/publish.yaml).
1. Click on the build you want to test.
1. Download the extension file from the _Artifacts_ section at the bottom.
1. Unpack the downloaded _.zip_ file and unpack the _sporran-???.zip_ from it as well.

### Getting the _public_ version of extension

1. Go to [actions page for "Packages the public version"](https://github.com/KILTprotocol/sporran-extension/actions/workflows/stores.yaml).
1. Click the buttons "Run workflow" -> "Run workflow" to prepare the public version and wait for the workflow to finish.
1. Click the link for the just finished workflow and download the extension file from the _Artifacts_ section at the bottom.
1. Unpack the downloaded _.zip_ file and unpack the _sporran-???.zip_ from it as well.

### Testing in [Chrome](https://developer.chrome.com/docs/extensions/mv2/getstarted/#manifest)

1. Navigate to [chrome://extensions](chrome://extensions).
1. Enable Developer Mode by clicking the toggle switch next to Developer mode.
1. Click the _Load unpacked_ button and select the directory you have unpacked the extension into.

### Testing in [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

1. Navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox).
1. Click the _Load Temporary Add-on..._ button.
1. Select the manifest.json from the directory you have unpacked the extension into.

## Build and package for uploading

Update the version in `src/static/manifest.json` and `src/configuration/configuration.ts`.

### For the external version

Run the following commands:

```
yarn install
yarn build
yarn package
```

This will generate a file `dist/web-ext-artifacts/sporran-???.zip` ready to be uploaded to stores.
This version will only connect to _KILT Spirinet_ blockchain via predefined node endpoints.

### For the internal version

Run the following commands:

```
yarn install
yarn build-internal
yarn package
```

This will generate a file `dist/web-ext-artifacts/sporran-???.zip` ready to be uploaded on the github's release site for developers to use.
This version will connect to any node endpoints the user inputs and by default to the _KILT Peregrine_ blockchain.

## Built with

- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [webextension-polyfill](https://github.com/mozilla/webextension-polyfill)

## Misc. References

- [Chrome Extension Developer Guide](https://developer.chrome.com/extensions/devguide)
- [Firefox Extension Developer Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
