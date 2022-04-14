import {
  identitiesMock,
  mockDialogShowModal,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';

import { IdentitySuccessOverlay } from './IdentitySuccessOverlay';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

describe('IdentitySuccessOverlay', () => {
  beforeEach(mockDialogShowModal);

  it('should render success overlay for created identity', async () => {
    const { container } = render(
      <IdentitySuccessOverlay
        identity={identity}
        successType="created"
        onSuccessOverlayButtonClick={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for imported identity', async () => {
    const { container } = render(
      <IdentitySuccessOverlay
        identity={identity}
        successType="imported"
        onSuccessOverlayButtonClick={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for reset password', async () => {
    const { container } = render(
      <IdentitySuccessOverlay
        identity={identity}
        successType="pwreset"
        onSuccessOverlayButtonClick={jest.fn()}
      />,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
