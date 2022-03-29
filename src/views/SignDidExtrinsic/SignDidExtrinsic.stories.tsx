import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import { paths } from '../paths';

import { SignDidExtrinsic } from './SignDidExtrinsic';

export default {
  title: 'Views/SignDidExtrinsic',
  component: SignDidExtrinsic,
} as Meta;

const input: SignDidExtrinsicOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  extrinsic: '0x1c0426000c666f6f',
  signer: '4tMMYZHsFfqzfCsgCPLJSBmomBv2d6cBEYzHKMGVKz2VjACR',
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input}>
      <SignDidExtrinsic
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />
    </PopupTestProvider>
  );
}
