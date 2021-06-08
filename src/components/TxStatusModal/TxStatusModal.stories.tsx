import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { accountsMock } from '../../utilities/accounts/AccountsProvider.mock';

import { TxStatusModal } from './TxStatusModal';

export default {
  title: 'Components/TxStatusModal',
  component: TxStatusModal,
} as Meta;

const account =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return (
    <TxStatusModal
      account={account}
      pending={true}
      handleClose={action('closeModal')}
    />
  );
}

export function TxSuccess(): JSX.Element {
  return (
    <TxStatusModal
      account={account}
      pending={false}
      handleClose={action('closeModal')}
    />
  );
}
