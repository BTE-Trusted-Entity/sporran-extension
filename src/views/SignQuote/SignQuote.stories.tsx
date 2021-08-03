import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { mockClaim } from '../../utilities/cTypes/cTypes.mock';

import { paths } from '../paths';

import { SignQuote } from './SignQuote';

export default {
  title: 'Views/SignQuote',
  component: SignQuote,
} as Meta;

const encodedData = window.btoa(JSON.stringify(mockClaim));

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.claim}?data=${encodedData}`]}>
      <SignQuote />
    </MemoryRouter>
  );
}
