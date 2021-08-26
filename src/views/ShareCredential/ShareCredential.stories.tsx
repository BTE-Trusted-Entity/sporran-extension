import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { ShareCredential } from './ShareCredential';

export default {
  title: 'Views/ShareCredential',
  component: ShareCredential,
} as Meta;

const mockClaimRequest = [
  {
    cTypeHash:
      '0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2',
  },
];

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.share} data={mockClaimRequest}>
      <ShareCredential />
    </PopupTestProvider>
  );
}
