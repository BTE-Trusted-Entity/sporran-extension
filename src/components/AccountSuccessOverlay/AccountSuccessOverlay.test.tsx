import { accountsMock, render } from '../../testing';
import { AccountSuccessOverlay } from './AccountSuccessOverlay';
const account =
  accountsMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('AccountSuccessOverlay', () => {
  it('should render success overlay for created account', async () => {
    const { container } = render(
      <AccountSuccessOverlay
        account={account}
        successType="created"
        onSuccessOverlayButtonClick={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for imported account', async () => {
    const { container } = render(
      <AccountSuccessOverlay
        account={account}
        successType="imported"
        onSuccessOverlayButtonClick={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for reset password', async () => {
    const { container } = render(
      <AccountSuccessOverlay
        account={account}
        successType="reset"
        onSuccessOverlayButtonClick={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
