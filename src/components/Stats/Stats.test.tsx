import { IdentitiesProviderMock, render, screen } from '../../testing/testing';
import { IdentitiesMap } from '../../utilities/identities/types';

import { Stats } from './Stats';

describe('Stats', () => {
  it('should not render for no identities', async () => {
    const { container } = render(
      <IdentitiesProviderMock identities={{}}>
        <Stats />
      </IdentitiesProviderMock>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render for single identity', async () => {
    const identities: IdentitiesMap = {
      '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1': {
        name: 'Light DID Identity',
        address: '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
        did: 'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
        index: 1,
      },
    };
    const { container } = render(
      <IdentitiesProviderMock identities={identities}>
        <Stats />
      </IdentitiesProviderMock>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should render for at least two identities', async () => {
    const { container } = render(<Stats />);
    expect(await screen.findByText(/Balance/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
