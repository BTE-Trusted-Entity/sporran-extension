import { accountsMock, render } from '../../testing';
import { SuccessTypes } from '../../utilities/accounts/types';
import { SuccessAccountOverlay } from './SuccessAcountOverlay';

describe('SuccessAccountOverlay', () => {
  it('should render success overlay for created account', async () => {
    const { container } = render(
      <SuccessAccountOverlay
        account={
          accountsMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
        successType={SuccessTypes.created}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for imported account', async () => {
    const { container } = render(
      <SuccessAccountOverlay
        account={
          accountsMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
        successType={SuccessTypes.imported}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render success overlay for reset password', async () => {
    const { container } = render(
      <SuccessAccountOverlay
        account={
          accountsMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
        }
        successType={SuccessTypes.reset}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
