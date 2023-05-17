import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { ShareIdentitiesOriginInput } from '../../channels/ShareIdentitiesChannels/types';
import { paths } from '../paths';

import { ShareIdentities } from './ShareIdentities';

export default {
  title: 'Views/ShareIdentities',
  component: ShareIdentities,
} as Meta;

const input: ShareIdentitiesOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.shareIdentities} data={input}>
      <ShareIdentities />
    </PopupTestProvider>
  );
}
