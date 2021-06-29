import BN from 'bn.js';

import { identitiesMock as identities, render } from '../../testing/testing';

import { ReviewTransaction } from './ReviewTransaction';

describe('ReviewTransaction', () => {
  it('should render', async () => {
    const { container } = render(
      <ReviewTransaction
        identity={
          identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
        recipient="4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos"
        amount={new BN((120e15).toString())}
        fee={new BN(1.25e7)}
        tip={new BN(0.01e15)}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
