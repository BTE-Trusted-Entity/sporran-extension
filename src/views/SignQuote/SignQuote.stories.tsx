import { Meta } from '@storybook/react';

import { mockTerms } from '../../utilities/cTypes/cTypes.mock';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { SignQuote } from './SignQuote';

export default {
  title: 'Views/SignQuote',
  component: SignQuote,
} as Meta;

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.claim} data={mockTerms}>
      <SignQuote
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />
    </PopupTestProvider>
  );
}
