import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

export default {
  title: 'Views/SaveCredential',
  component: SaveCredential,
} as Meta;

export { SaveCredential };

const query = 'claimHash=0xclaimHash';

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.save}?${query}`]}>
      <SaveCredential />
    </MemoryRouter>
  );
}
