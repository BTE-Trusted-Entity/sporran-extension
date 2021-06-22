import { MemoryRouter, Route } from 'react-router-dom';

import {
  identitiesMock as identities,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';
import { NEW } from '../../utilities/identities/identities';
import '../../components/useCopyButton/useCopyButton.mock';
import { paths } from '../paths';

import { ReceiveToken } from './ReceiveToken';

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('ReceiveToken', () => {
  it('should render a normal identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/receive`]}>
        <Route path={paths.identity.receive}>
          <ReceiveToken identity={identity} />,
        </Route>
      </MemoryRouter>,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/identity/NEW/receive']}>
        <Route path={paths.identity.receive}>
          <ReceiveToken identity={NEW} />,
        </Route>
      </MemoryRouter>,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
