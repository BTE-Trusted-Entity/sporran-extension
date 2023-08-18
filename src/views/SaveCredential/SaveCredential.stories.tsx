import { Meta } from '@storybook/react';

import { mockAttestations } from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

export default {
  title: 'Views/SaveCredential',
  component: SaveCredential,
} as Meta;

const { downloaded, notDownloaded } = mockAttestations;

export function Downloaded() {
  return (
    <PopupTestProvider path={paths.popup.save} data={downloaded}>
      <SaveCredential />
    </PopupTestProvider>
  );
}

export function NotDownloaded() {
  return (
    <PopupTestProvider path={paths.popup.save} data={notDownloaded}>
      <SaveCredential />
    </PopupTestProvider>
  );
}
