// src/__mocks__/webextension-polyfill-ts
// Update this file to include any mocks for the `webextension-polyfill-ts` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser

import { setupGetMessageShim } from 'chrome-extension-i18n-shim';

import messagesEN from '../static/_locales/en/messages.json';

export const browser = {
  tabs: {
    executeScript(
      currentTabId: number /* eslint-disable-line @typescript-eslint/no-unused-vars */,
      details: unknown /* eslint-disable-line @typescript-eslint/no-unused-vars */,
    ): Promise<{ done: boolean }> {
      return Promise.resolve({ done: true });
    },
  },
  i18n: {
    getMessage: setupGetMessageShim(messagesEN),
    getUILanguage(): string {
      return document.documentElement.lang || 'en';
    },
  },
  storage: {
    local: {
      async get(): Promise<unknown> {
        return {
          authorizedDApps: {
            'example.com': false,
            'example.org': true,
          },
          'credential:0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae':
            {
              request: {
                claim: {
                  cTypeHash:
                    '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
                  contents: {
                    Email: 'mockEmail@mock.mock',
                  },
                  owner:
                    'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
                },
                claimHashes: [
                  '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
                  '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
                  '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
                  '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
                ],
                claimNonceMap: {
                  '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
                    'd0c9d647-42ef-4d44-b603-3b776260a6dd',
                  '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
                    '6b62308c-8557-4b61-ac02-8f905555d67b',
                  '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
                    '247394c0-d46b-482a-b0c5-493aeb506d61',
                  '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
                    '07b95f17-3f23-4a9e-8f43-33881273682c',
                },
                legitimations: [],
                delegationId: null,
                rootHash:
                  '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae',
              },
              name: 'Email Credential',
              cTypeTitle: 'Email',
              attester: 'Trusted Entity attester',
              status: 'attested',
            },
        };
      },
      async set(): Promise<void> {
        // dummy
      },
    },
  },
  runtime: {
    async sendMessage(): Promise<void> {
      // dummy
    },
    onMessage: {
      addListener(): void {
        // dummy
      },
      removeListener(): void {
        // dummy
      },
    },
  },
};

export interface Tabs {
  Tab: {
    id: number;
  };
}
