import { MemoryRouter, Route } from 'react-router-dom';

import {
  identitiesMock as fewIdentities,
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
        <Route path={paths.identity.overview}>
          <IdentitiesCarousel
            identity={
              fewIdentities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the first identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Route path={paths.identity.overview}>
          <IdentitiesCarousel
            identity={
              fewIdentities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the last identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Route path={paths.identity.overview}>
          <IdentitiesCarousel
            identity={
              fewIdentities['4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Route path={paths.identity.overview}>
          <IdentitiesCarousel identity={NEW} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should support other paths', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.popup.claim]}>
        <Route path={paths.popup.claim}>
          <IdentitiesCarousel
            identity={
              fewIdentities['4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653']
            }
          />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a bubble for each identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Route path={paths.identity.overview}>
          <IdentitiesBubbles
            identities={Object.values(fewIdentities)}
            showAdd={true}
          />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should not render bubbles if number of identities is more than the maximum', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[paths.identity.overview]}>
        <Route path={paths.identity.overview}>
          <IdentitiesBubbles
            identities={Object.values(moreIdentities)}
            showAdd={true}
          />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
