import { Meta } from '@storybook/react';
import { ReceiveToken } from './ReceiveToken';

export default {
  title: 'Views/ReceiveToken',
  component: ReceiveToken,
} as Meta;

export function Template(): JSX.Element {
  return (
    <ReceiveToken
      account={{
        name: 'My Sporran Account',
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
      }}
    />
  );
}
