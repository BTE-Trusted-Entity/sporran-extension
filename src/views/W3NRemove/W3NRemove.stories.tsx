import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NRemove } from './W3NRemove';

export default {
  title: 'Views/W3NRemove',
  component: W3NRemove,
} as Meta;

export function NoRefund(): JSX.Element {
  return (
    <W3NRemove
      identity={identities['4tayr7qa5BoqQjbpDdVSkJNHYBCx9BZ2baf5fkJjFXehZKKe']}
    />
  );
}

export function Refund(): JSX.Element {
  return (
    <W3NRemove
      identity={identities['4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q']}
    />
  );
}
