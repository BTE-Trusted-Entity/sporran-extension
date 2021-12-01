import { MemoryRouter, Route, Routes, Switch } from 'react-router-dom';
import {
  identitiesMock as identities,
  moreIdentitiesMock as moreIdentities,
  render,
} from '../../testing/testing';
import { paths } from '../../views/paths';

import { NEW } from '../../utilities/identities/identities';

import { IdentitiesCarousel, IdentitiesBubbles } from './IdentitiesCarousel';

describe('IdentitiesCarousel', () => {
  it('should render normal identities', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Routes>
          <Route path={paths.identity.overview}>
            <IdentitiesCarousel
              identity={
                identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the first identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Routes>
          <Route path={paths.identity.overview}>
            <IdentitiesCarousel
              identity={
                identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the last identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Routes>
          <Route path={paths.identity.overview}>
            <IdentitiesCarousel
              identity={
                identities['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Routes>
          <Route path={paths.identity.overview}>
            <IdentitiesCarousel identity={NEW} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should support other paths', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.send.start]}>
        <Routes>
          <Route path={paths.identity.send.start}>
            <IdentitiesCarousel
              identity={
                identities['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a bubble for each identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Routes>
          <Route path={paths.identity.overview}>
            <IdentitiesBubbles
              identities={Object.values(identities)}
              showAdd={true}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should not render bubbles if number of identities is more than the maximum', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Routes>
          <Route path={paths.identity.overview}>
            <IdentitiesBubbles
              identities={Object.values(moreIdentities)}
              showAdd={true}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
