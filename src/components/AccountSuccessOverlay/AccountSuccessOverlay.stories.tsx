import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import { accountsMock } from '../../utilities/accounts/AccountsProvider.mock';
import { AccountSuccessOverlay } from './AccountSuccessOverlay';

export default {
  title: 'Components/AccountSuccessOverlay',
  component: AccountSuccessOverlay,
} as Meta;

const account =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return (
    <AccountSuccessOverlay
      account={account}
      successType="created"
      onSuccessOverlayButtonClick={action('closeOverlay')}
    />
  );
}

export function Imported(): JSX.Element {
  return (
    <AccountSuccessOverlay
      account={account}
      successType="imported"
      onSuccessOverlayButtonClick={action('closeOverlay')}
    />
  );
}

export function Reset(): JSX.Element {
  return (
    <AccountSuccessOverlay
      account={account}
      successType="pwreset"
      onSuccessOverlayButtonClick={action('closeOverlay')}
    />
  );
}
