import { Meta } from '@storybook/react';

import { paths } from '../../views/paths';

import { BalanceUpdateLinkTemplate } from './BalanceUpdateLink';

export default {
  title: 'Components/BalanceUpdateLink',
  component: BalanceUpdateLinkTemplate,
} as Meta;

export function Active(): JSX.Element {
  return (
    <BalanceUpdateLinkTemplate
      address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      disabled={false}
      path={paths.account.vest.sign}
    />
  );
}

export function Disabled(): JSX.Element {
  return (
    <BalanceUpdateLinkTemplate
      address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      disabled={true}
      path={paths.account.vest.sign}
    />
  );
}
