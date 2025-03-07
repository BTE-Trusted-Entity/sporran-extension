# DApp development with Sporran

Sporran is designed to communicate with DApps built on the KILT blockchain. If you’re developing your own DApp, or trying out KILT’s example DApps [CertifiedProof](https://github.com/KILTprotocol/CertifiedProof) and [ProofCheck](https://github.com/KILTprotocol/ProofCheck), it’s helpful to have a test wallet with play coins that you can use in conjunction with your development environment.

## Quick start _with play coins_

1. We recommend using a different browser or a different profile of your browser
   to avoid mixing up the real Sporran and the play coins Sporran
2. Download the test version of Sporran (TEST-sporran-?.zip) from the [releases page](https://github.com/BTE-Trusted-Entity/sporran-extension/releases) and unpack it
3. Start Chrome and navigate to chrome://extensions (or in Firefox about:debugging#/runtime/this-firefox)
4. Enable Developer Mode by clicking the toggle switch next to Developer mode (Chrome only)
5. Click the _Load unpacked_ button and select the `TEST-sporran` directory
   (or in Firefox click _Load Temporary Add-on..._ and select `TEST-sporran/manifest.json`)
6. Now you have the internal version of Sporran installed. **DO NOT USE IT** for real KILT identities/addresses/coins!
   Choose `wss://peregrine.kilt.io` in _⚙ Settings > Custom Endpoint_.
   Click the Sporran icon in the browser toolbar and follow the flow to create an Identity.
   Click the _Receive_ link and copy the Identity address on the next screen.
7. Visit the [Faucet](https://substratefaucet.xyz/kilt), paste the Identity address there, accept the Terms,
   and click _Request Tokens_ to get some play KILT coins
