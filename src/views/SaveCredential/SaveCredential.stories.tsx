import { Meta } from '@storybook/react';

import { mockAttestation } from '../../utilities/credentials/credentials.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

export default {
  title: 'Views/SaveCredential',
  component: SaveCredential,
} as Meta;

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.save} data={mockAttestation}>
      <SaveCredential />
    </PopupTestProvider>
  );
}
