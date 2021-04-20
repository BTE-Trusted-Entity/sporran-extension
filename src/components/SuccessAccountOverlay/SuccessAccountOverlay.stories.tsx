import { Meta } from '@storybook/react';
import { accountsMock } from '../../testing/AccountsProviderMock';
import { SuccessTypes } from '../../utilities/accounts/types';
import { SuccessAccountOverlay } from './SuccessAcountOverlay';

export default {
  title: 'Components/SuccessAccountOverlay',
  component: SuccessAccountOverlay,
  decorators: [(story) => <div style={{ textAlign: 'center' }}>{story()}</div>],
} as Meta;

export function Template(): JSX.Element {
  return (
    <SuccessAccountOverlay
      account={accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      successType={SuccessTypes.created}
    />
  );
}

export function Imported(): JSX.Element {
  return (
    <SuccessAccountOverlay
      account={accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      successType={SuccessTypes.imported}
    />
  );
}

export function Reset(): JSX.Element {
  return (
    <SuccessAccountOverlay
      account={accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      successType={SuccessTypes.reset}
    />
  );
}
