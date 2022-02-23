import { IdentitiesProviderMock, render, screen } from '../../testing/testing';

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
    const identities = {
      '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
        name: 'KILT Identity 1',
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
        did: 'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
