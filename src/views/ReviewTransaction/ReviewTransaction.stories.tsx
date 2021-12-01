import { Meta } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BN from 'bn.js';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { ReviewTransaction } from './ReviewTransaction';
import { Switch } from 'react-router-dom';

export default {
  title: 'Views/ReviewTransaction',
  component: ReviewTransaction,
} as Meta;

export function Template(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        '/identity/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/send/review',
      ]}
    >
      <Routes>
        <Route path={paths.identity.send.review}>
          <ReviewTransaction
            identity={
              identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
            }
            recipient="4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos"
            amount={new BN((120e15).toString())}
            fee={new BN(1.25e7)}
            tip={new BN(0.01e15)}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
