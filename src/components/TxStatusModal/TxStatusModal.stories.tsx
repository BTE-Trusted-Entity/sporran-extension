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
