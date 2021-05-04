import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { paths } from '../paths';

import { SaveCredential } from './SaveCredential';

export default {
  title: 'Views/SaveCredential',
  component: SaveCredential,
} as Meta;

export { SaveCredential };

const query =
  'Full+Name=Ingo+R%C3%BCbe&Email=ingo%40kilt.io&Credential+type=BL-Mail-Simple&Attester=BOTLabs&credential=eyJlbWFpbCI6ImluZ29Aa2lsdC5pbyJ9';

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.save}?${query}`]}>
      <SaveCredential />
    </MemoryRouter>
  );
}
