import { Meta } from '@storybook/react';

import { BalanceUpdateLink } from './BalanceUpdateLink';

export default {
  title: 'Components/BalanceUpdateLink',
  component: BalanceUpdateLink,
} as Meta;

export function Active(): JSX.Element {
  return (
    <BalanceUpdateLink
      address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      disabled={false}
    />
  );
}

export function Disabled(): JSX.Element {
  return (
    <BalanceUpdateLink
      address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      disabled={true}
    />
  );
}
