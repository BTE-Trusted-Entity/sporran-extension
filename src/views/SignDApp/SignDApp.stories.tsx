import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { SignOriginInput } from '../../dApps/SignChannels/types';
import { paths } from '../paths';

import { SignDApp } from './SignDApp';

export default {
  title: 'Views/SignDApp',
  component: SignDApp,
} as Meta;

const mockExtrinsic: SignOriginInput = {
  origin:
    'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  address: '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
  specVersion: '0x00002846',
  nonce: '0x000000000000001a',
  method:
    '0x060300ea49da64fa986e3d764cb202c917ec4f6ae1dfbfc60c2fca3ad1ed2b013ac35f00',
  dAppName: 'polkadot-js/apps',
  id: 2,
  transactionVersion: '0x00000002',
  blockHash:
    '0x22aad1dc6447bab6b09cdb4ce34a9901748eb871ecede13b3154c4a3c468ca66',
  blockNumber: '0x00000000000bff94',
  era: '0x4401',
  genesisHash:
    '0xf25c85c4ffc4863b599a443e5301f7f4120c9a21042d35942b9e844346060db1',
  signedExtensions: [
    'CheckSpecVersion',
    'CheckTxVersion',
    'CheckGenesis',
    'CheckMortality',
    'CheckNonce',
    'CheckWeight',
    'ChargeTransactionPayment',
  ],
  tip: '0x00000000000000000000000000000000',
  version: 4,
};

export function Template() {
  return (
    <PopupTestProvider path={paths.popup.sign} data={mockExtrinsic}>
      <SignDApp />
    </PopupTestProvider>
  );
}

export function Unknown() {
  return (
    <PopupTestProvider
      path={paths.popup.sign}
      data={{
        ...mockExtrinsic,
        address: '4qp7KB8jbwqS6XXL8zH8qZn3GCdnZDt6Nmq5M47ztGKhXJVh',
      }}
    >
      <SignDApp />
    </PopupTestProvider>
  );
}
