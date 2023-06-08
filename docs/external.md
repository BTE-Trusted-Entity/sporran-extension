# DApp development with Sporran

Sporran is designed to communicate with DApps built on the KILT blockchain. If you're developing your own DApp, or trying out KILT's example DApps [CertifiedProof](https://github.com/KILTprotocol/CertifiedProof) and [ProofCheck](https://github.com/KILTprotocol/ProofCheck), it's helpful to have a test wallet with play coins that you can use in conjunction with your development environment.

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

## Built with

- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [webextension-polyfill-ts](https://github.com/Lusito/webextension-polyfill-ts)

## Misc. References

- [Chrome Extension Developer Guide](https://developer.chrome.com/extensions/devguide)
- [Firefox Extension Developer Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
