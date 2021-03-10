# sporran-extension

## Testing in browser

### Getting the extension

1. Go to [actions page](https://github.com/KILTprotocol/sporran-extension/actions).
1. Click on the build you want to test.
1. Download the extension file from the _Artifacts_ section at the bottom.
1. Unpack the downloaded _.zip_ file and unpack the _sporran-1.0.0.zip_ from it as well.


### Testing in [Chrome](https://developer.chrome.com/docs/extensions/mv2/getstarted/#manifest)

1. Navigate to [chrome://extensions](chrome://extensions).
1. Enable Developer Mode by clicking the toggle switch next to Developer mode.
1. Click the _LOAD UNPACKED_ button and select the directory you have unpacked the extension into.


### Testing in [Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

1. Navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox).
1. Click the _Load Temporary Add-on..._ button.
1. Select the manfiest.json from the directory you have unpacked the extension into.


## Getting Started

Run the following commands to install dependencies and start developing

```
yarn install
yarn dev
```

## Scripts

-   `yarn dev` - run `webpack` in `watch` mode
-   `yarn storybook` - runs the Storybook server
-   `yarn build` - builds the production-ready unpacked extension
-   `yarn test -u` - runs Jest + updates test snapshots
-   `yarn lint` - runs EsLint
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
