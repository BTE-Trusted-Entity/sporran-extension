import { Meta } from '@storybook/react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NRemove } from './W3NRemove';

export default {
  title: 'Views/W3NRemove',
  component: W3NRemove,
} as Meta;

export function NoRefund(): JSX.Element {
  return (
    <W3NRemove
      identity={identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
    />
  );
}

export function Refund(): JSX.Element {
  return (
    <W3NRemove
      identity={identities['4pzncei2Jjap98Xks5XjoBKxBeYoCzofhbki7e3sZGnqDHvK']}
    />
  );
}
