import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { DidServiceEndpoint } from '@kiltprotocol/sdk-js';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidEndpointsSign } from './DidEndpointsSign';

export default {
  title: 'Views/DidEndpointsSign',
  component: DidEndpointsSign,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const endpoint: DidServiceEndpoint = {
  serviceEndpoint: ['https://sporran.org/'],
  type: ['Some Type'],
  id: '#123456',
};

const longUrlEndpoint: DidServiceEndpoint = {
  ...endpoint,
  serviceEndpoint: [
    'https://www.this-is-a-super-long-url/which-just-keeps-going-and-going/to-test-the-overflow-behaviour-of-the-url-value',
  ],
};

export function Add(): JSX.Element {
  return (
    <DidEndpointsSign type="add" identity={identity} endpoint={endpoint} />
  );
}

export function Remove(): JSX.Element {
  return (
    <DidEndpointsSign type="remove" identity={identity} endpoint={endpoint} />
  );
}

export function LongUrl(): JSX.Element {
  return (
    <DidEndpointsSign
      type="add"
      identity={identity}
      endpoint={longUrlEndpoint}
    />
  );
}
