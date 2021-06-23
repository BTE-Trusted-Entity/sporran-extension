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
      <IdentitiesCarousel
        path={paths.identity.overview}
        identity={
          identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the first identity', async () => {
    const { container } = render(
      <IdentitiesCarousel
        path={paths.identity.overview}
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the last identity', async () => {
    const { container } = render(
      <IdentitiesCarousel
        path={paths.identity.overview}
        identity={
          identities['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <IdentitiesCarousel path={paths.identity.overview} identity={NEW} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should support other paths', async () => {
    const { container } = render(
      <IdentitiesCarousel
        path={paths.identity.send.start}
        identity={
          identities['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render a bubble for each identity', async () => {
    const { container } = render(
      <IdentitiesBubbles
        identities={Object.values(identities)}
        path={paths.identity.overview}
      />,
    );

    expect(container).toMatchSnapshot();
  });
  it('should not render bubbles if number of identities is more than the maximum', async () => {
    const { container } = render(
      <IdentitiesBubbles
        identities={Object.values(moreIdentities)}
        path={paths.identity.overview}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
