import type { Service } from '@kiltprotocol/types';

import { Meta } from '@storybook/react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidEndpointsSign } from './DidEndpointsSign';

export default {
  title: 'Views/DidEndpointsSign',
  component: DidEndpointsSign,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const endpoint: Service = {
  serviceEndpoint: ['https://sporran.org/'],
  type: ['Some Type'],
  id: '#123456',
};

const longUrlEndpoint: Service = {
  ...endpoint,
  serviceEndpoint: [
    'https://www.this-is-a-super-long-url/which-just-keeps-going-and-going/to-test-the-overflow-behaviour-of-the-url-value',
  ],
};

export function Add() {
  return (
    <DidEndpointsSign type="add" identity={identity} endpoint={endpoint} />
  );
}

export function Remove() {
  return (
    <DidEndpointsSign type="remove" identity={identity} endpoint={endpoint} />
  );
}

export function LongUrl() {
  return (
    <DidEndpointsSign
      type="add"
      identity={identity}
      endpoint={longUrlEndpoint}
    />
  );
}
