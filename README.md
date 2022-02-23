# sporran-extension
![kilt](https://user-images.githubusercontent.com/1248214/110625865-49edbe00-81a0-11eb-9393-596c6a1f8eba.png)

## Quick start _with play coins_

1. We recommend using a different browser or a different profile of your browser
   to avoid mixing up the real Sporran and the play coins Sporran
1. Have git, Node.js, and yarn installed
1. `git clone https://github.com/KILTprotocol/sporran-extension.git`
1. `cd sporran-extension`
1. `yarn install && yarn dev`
1. Start Chrome and navigate to chrome://extensions (or in Firefox about:debugging#/runtime/this-firefox)
1. Enable Developer Mode by clicking the toggle switch next to Developer mode (Chrome only)
1. Click the _Load unpacked_ button and select the `sporran-extension/dist` directory
   (or in Firefox click _Load Temporary Add-on..._ and select `sporran-extension/dist/manifest.json`)
1. Now you have the internal version of Sporran installed. **DO NOT USE IT** for real KILT identities/addresses/coins!
   Choose `wss://peregrine.kilt.io/parachain-public-ws` in _⚙ Settings > Custom Endpoint_.
   Click the Sporran icon in the browser toolbar and follow the flow to create an Identity.
   Click the _Receive_ link and copy the Identity address on the next screen.
1. Visit the [Faucet](https://faucet.peregrine.kilt.io/), paste the Identity address there, accept the Terms,
   and click _Request Tokens_ to get some play KILT coins

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


## Getting Started

Run the following commands to install dependencies and start developing

```
yarn install
yarn dev
```


## Build and package for uploading

Update the version in `src/static/manifest.json` and `src/configuration/configuration.ts`.

Run the following commands:

```
yarn install
yarn build
yarn package
```

This will generate a file `dist/web-ext-artifacts/sporran-???.zip` ready to be uploaded to stores.


## Scripts

-   `yarn dev` - run `webpack` in `watch` mode
-   `yarn storybook` - runs the Storybook server
-   `yarn build` - builds the production-ready unpacked extension
-   `yarn package` - packages the built code for upload
-   `yarn test -u` - runs Jest + updates test snapshots
-   `yarn lint` - runs Stylelint and ESLint
-   `yarn prettify` - runs Prettier
-   `yarn open-firefox` - opens Sporran in Firefox
-   `yarn open-chrome` - opens Sporran in Chrome

## Notes

-   Includes a custom mock for the [webextension-polyfill-ts](https://github.com/Lusito/webextension-polyfill-ts) package in `src/__mocks__`. This allows you to mock any browser APIs used by your extension so you can develop your components inside Storybook.

## Built with

-   [React](https://reactjs.org)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Storybook](https://storybook.js.org/)
-   [Jest](https://jestjs.io)
-   [Eslint](https://eslint.org/)
-   [Prettier](https://prettier.io/)
-   [Webpack](https://webpack.js.org/)
-   [Babel](https://babeljs.io/)
-   [webextension-polyfill-ts](https://github.com/Lusito/webextension-polyfill-ts)

## Misc. References

-   [Chrome Extension Developer Guide](https://developer.chrome.com/extensions/devguide)
-   [Firefox Extension Developer Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
