import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { mockAttestation } from '../../utilities/credentials/credentials.mock';
import { jsonToBase64 } from '../../utilities/popups/usePopupData';
import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

export default {
  title: 'Views/SaveCredential',
  component: SaveCredential,
} as Meta;

export { SaveCredential };

const encodedData = jsonToBase64(mockAttestation);

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.save}?data=${encodedData}`]}>
      <SaveCredential />
    </MemoryRouter>
  );
}
