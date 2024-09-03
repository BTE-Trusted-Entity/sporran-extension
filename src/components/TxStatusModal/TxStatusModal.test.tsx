import {
  identitiesMock,
  mockDialogShowModal,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';

import { TxStatusModal } from './TxStatusModal';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

jest.mock('../../utilities/endpoints/getChainName', () => ({
  getChainName: () => 'KILT Peregrine',
}));

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
