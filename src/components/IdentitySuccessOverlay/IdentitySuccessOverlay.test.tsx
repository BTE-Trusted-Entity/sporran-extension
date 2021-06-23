import {
  identitiesMock,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';
import { IdentitySuccessOverlay } from './IdentitySuccessOverlay';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('IdentitySuccessOverlay', () => {
  beforeEach(() => {
    (
      HTMLDialogElement.prototype as unknown as {
        showModal: () => void;
      }
    ).showModal = jest.fn();
  });

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
