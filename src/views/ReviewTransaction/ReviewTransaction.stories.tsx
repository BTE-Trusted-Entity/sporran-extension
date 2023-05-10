import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { BalanceUtils } from '@kiltprotocol/sdk-js';

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
        '/identity/4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1/send/review',
      ]}
    >
      <Route path={paths.identity.send.review}>
        <ReviewTransaction
          identity={
            identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
          }
          recipient="4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo"
          amount={BalanceUtils.toFemtoKilt(120)}
          fee={BalanceUtils.toFemtoKilt(0.01)}
          tip={BalanceUtils.toFemtoKilt(0.01)}
        />
      </Route>
    </MemoryRouter>
  );
}
