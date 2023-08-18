import { Meta } from '@storybook/react';

import { mockTerms } from '../../utilities/mockTerms/mockTerms';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

export default {
  title: 'Views/SignQuote',
  component: SignQuote,
} as Meta;

export function Template() {
  return (
    <PopupTestProvider path={paths.popup.claim} data={mockTerms}>
      <SignQuote
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />
    </PopupTestProvider>
  );
}

export function OnChainDidDeleted() {
  return (
    <PopupTestProvider path={paths.popup.claim} data={mockTerms}>
      <SignQuote
        identity={
          identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
        }
      />
    </PopupTestProvider>
  );
}
