import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { paths } from '../paths';

import { SignQuote } from './SignQuote';

export default {
  title: 'Views/SignQuote',
  component: SignQuote,
} as Meta;

const query =
  'Full+Name=Ingo+R%C3%BCbe&Email=ingo%40kilt.io&Credential+type=BL-Mail-Simple&Attester=SocialKYC';

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.claim}?${query}`]}>
      <SignQuote />
    </MemoryRouter>
  );
}
