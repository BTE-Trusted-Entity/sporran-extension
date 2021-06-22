import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock, render } from '../../testing/testing';
import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentityOverview } from './IdentityOverview';

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('IdentityOverview', () => {
  it('should render a normal identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />,
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/identity/NEW/']}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={NEW} />,
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
