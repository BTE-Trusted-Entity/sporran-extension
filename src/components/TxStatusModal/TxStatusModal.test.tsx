import {
  identitiesMock,
  mockDialogShowModal,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';

import { TxStatusModal } from './TxStatusModal';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('TxStatusModal', () => {
  beforeEach(mockDialogShowModal);

  it('should show completed status', async () => {
    const { container } = render(
      <TxStatusModal
        identity={identity}
        status="success"
        onDismissError={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should show pending status', async () => {
    const { container } = render(
      <TxStatusModal
        identity={identity}
        status="pending"
        onDismissError={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should show error status', async () => {
    const { container } = render(
      <TxStatusModal
        identity={identity}
        status="error"
        onDismissError={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
