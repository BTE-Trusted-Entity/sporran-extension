import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IDidServiceEndpoint } from '@kiltprotocol/types';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidEndpointsForm } from './DidEndpointsForm';

export default {
  title: 'Views/DidEndpointsForm',
  component: DidEndpointsForm,
} as Meta;

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

const endpoints: IDidServiceEndpoint[] = [
  {
    urls: ['https://sporran.org/'],
    types: ['Some Type'],
    id: `${identity.did}#123456`,
  },
  {
    urls: ['https://kilt.io/'],
    types: ['Another Type'],
    id: `${identity.did}#654321`,
  },
];

export function Template(): JSX.Element {
  return (
    <DidEndpointsForm
      identity={identity}
      endpoints={endpoints}
      onAdd={action('add')}
      onRemove={action('remove')}
    />
  );
}
