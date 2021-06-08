import {
  accountsMock,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';

import { TxStatusModal } from './TxStatusModal';

const account =
  accountsMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('TxStatusModal', () => {
  beforeEach(() => {
    (
      HTMLDialogElement.prototype as unknown as {
        showModal: () => void;
      }
    ).showModal = jest.fn();
  });

  it('should show completed status', async () => {
    const { container } = render(
      <TxStatusModal
        account={account}
        pending={false}
        handleClose={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should show pending status', async () => {
    const { container } = render(
      <TxStatusModal
        account={account}
        pending={true}
        handleClose={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
