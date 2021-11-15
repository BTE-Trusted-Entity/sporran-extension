import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { ExtrinsicData, SignDApp } from './SignDApp';

export default {
  title: 'Views/SignDApp',
  component: SignDApp,
} as Meta;

const mockExtrinsic: ExtrinsicData = {
  origin:
    'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  specVersion: 1,
  nonce: 1,
  method:
    'namespace.method(input = "some meaningful values you would definitely like to see")',
  lifetimeStart: 1,
  lifetimeEnd: 1000000,
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.sign} data={mockExtrinsic}>
      <SignDApp />
    </PopupTestProvider>
  );
}
