import { Meta } from '@storybook/react';

import { mockClaim } from '../../utilities/cTypes/cTypes.mock';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

export default {
  title: 'Views/SignQuote',
  component: SignQuote,
} as Meta;

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.claim} data={mockClaim}>
      <SignQuote />
    </PopupTestProvider>
  );
}
