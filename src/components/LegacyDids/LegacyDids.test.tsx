import {
  mockDialogShowModal,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';
import { needLegacyDidCrypto } from '../../utilities/did/did';

import { LegacyDids } from './LegacyDids';

describe('LegacyDids', () => {
  beforeEach(mockDialogShowModal);

  it('should render', async () => {
    jest.mocked(needLegacyDidCrypto).mockResolvedValue(true);

    const { container } = render(<LegacyDids />);
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
