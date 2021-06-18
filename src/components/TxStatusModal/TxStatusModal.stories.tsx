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

export function TxPending(): JSX.Element {
  return (
    <TxStatusModal
      account={account}
      status="pending"
      onClose={action('closeModal')}
    />
  );
}

export function TxSuccess(): JSX.Element {
  return (
    <TxStatusModal
      account={account}
      status="success"
      onClose={action('closeModal')}
    />
  );
}

export function TxError(): JSX.Element {
  return (
    <TxStatusModal
      account={account}
      status="error"
      onClose={action('closeModal')}
    />
  );
}
