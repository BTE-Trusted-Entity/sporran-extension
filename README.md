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
