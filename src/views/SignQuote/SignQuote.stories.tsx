import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { mockClaim } from '../../utilities/cTypes/cTypes.mock';

import { jsonToBase64 } from '../../utilities/popups/usePopupData';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

export default {
  title: 'Views/SignQuote',
  component: SignQuote,
} as Meta;

const encodedData = jsonToBase64(mockClaim);

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.claim}?data=${encodedData}`]}>
      <SignQuote />
    </MemoryRouter>
  );
}
