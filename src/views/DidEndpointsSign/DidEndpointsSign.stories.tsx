import { Meta } from '@storybook/react';
import { DidServiceEndpoint } from '@kiltprotocol/types';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidEndpointsSign } from './DidEndpointsSign';

export default {
  title: 'Views/DidEndpointsSign',
  component: DidEndpointsSign,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const endpoint: DidServiceEndpoint = {
  urls: ['https://sporran.org/'],
  types: ['Some Type'],
  id: `${identity.did}#123456`,
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
