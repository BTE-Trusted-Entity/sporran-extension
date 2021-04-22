import { action } from '@storybook/addon-actions';
import { accountsMock, render } from '../../testing';
import { SuccessAccountOverlay } from './SuccessAcountOverlay';
const account =
  accountsMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('SuccessAccountOverlay', () => {
  it('should render success overlay for created account', async () => {
    const { container } = render(
      <SuccessAccountOverlay
        account={account}
        successType="created"
        openOverlayHandler={action('closeOverlay')}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for imported account', async () => {
    const { container } = render(
      <SuccessAccountOverlay
        account={account}
        successType="imported"
        openOverlayHandler={action('closeOverlay')}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for reset password', async () => {
    const { container } = render(
      <SuccessAccountOverlay
        account={account}
        successType="reset"
        openOverlayHandler={action('closeOverlay')}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
