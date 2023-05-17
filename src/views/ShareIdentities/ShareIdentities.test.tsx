import { render } from '../../testing/testing';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../paths';
import { ShareIdentitiesOriginInput } from '../../channels/ShareIdentitiesChannels/types';

import { ShareIdentities } from './ShareIdentities';

const mockInput: ShareIdentitiesOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
};

describe('ShareIdentities', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.shareIdentities} data={mockInput}>
        <ShareIdentities />
      </PopupTestProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});
