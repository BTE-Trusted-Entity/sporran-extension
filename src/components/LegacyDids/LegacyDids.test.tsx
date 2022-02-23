import { act } from '@testing-library/react';

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
    const legacyPromise = Promise.resolve(true);

    jest.mocked(needLegacyDidCrypto).mockReturnValue(legacyPromise);

    const { container } = render(<LegacyDids />);
    await waitForDialogUpdate();
    await act(async () => {
      await legacyPromise;
    });
    expect(container).toMatchSnapshot();
  });
});
