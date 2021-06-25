import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { TxStatusModal } from './TxStatusModal';

export default {
  title: 'Components/TxStatusModal',
  component: TxStatusModal,
} as Meta;

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function TxPending(): JSX.Element {
  return (
    <TxStatusModal
      identity={identity}
      status="pending"
      onDismissError={action('closeModal')}
    />
  );
}

export function TxSuccess(): JSX.Element {
  return (
    <TxStatusModal
      identity={identity}
      status="success"
      txHash="0x80284ac035b933c529e1742ec689e833eb0af50e960e837a2cc8048c33e7d82c"
      onDismissError={action('closeModal')}
    />
  );
}

export function TxError(): JSX.Element {
  return (
    <TxStatusModal
      identity={identity}
      status="error"
      onDismissError={action('closeModal')}
    />
  );
}
