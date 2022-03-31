import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { BalanceUtils } from '@kiltprotocol/core';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { ReviewTransaction } from './ReviewTransaction';

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
      <Route path={paths.identity.send.review}>
        <ReviewTransaction
          identity={
            identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
          }
          recipient="4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos"
          amount={BalanceUtils.toFemtoKilt(120)}
          fee={BalanceUtils.toFemtoKilt(0.00000001)}
          tip={BalanceUtils.toFemtoKilt(0.01)}
        />
      </Route>
    </MemoryRouter>
  );
}
