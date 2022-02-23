import {
  identitiesMock,
  mockDialogShowModal,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';

import { LegacyDids } from './LegacyDids';

describe('LegacyDids', () => {
  beforeEach(mockDialogShowModal);

  it('should render', async () => {
    const { container } = render(
      <LegacyDids identities={identitiesMock} onClose={jest.fn()} />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
