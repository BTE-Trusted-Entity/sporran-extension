import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';
import { accountsMock } from '../../testing/AccountsProviderMock';
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
      successType="created"
      openOverlayHandler={action('closeOverlay')}
    />
  );
}

export function Imported(): JSX.Element {
  return (
    <SuccessAccountOverlay
      account={accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      successType="imported"
      openOverlayHandler={action('closeOverlay')}
    />
  );
}

export function Reset(): JSX.Element {
  return (
    <SuccessAccountOverlay
      account={accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      successType="reset"
      openOverlayHandler={action('closeOverlay')}
    />
  );
}
