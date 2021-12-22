import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SignRawData, SignRawDApp } from './SignRawDApp';

export default {
  title: 'Views/SignRawDApp',
  component: SignRawDApp,
} as Meta;

const mockExtrinsic: SignRawData = {
  origin:
    'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  id: 1,
  data: '0xCAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFE',
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.sign} data={mockExtrinsic}>
      <SignRawDApp />
    </PopupTestProvider>
  );
}
