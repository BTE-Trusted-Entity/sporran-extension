import { Meta } from '@storybook/react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidDowngrade } from './DidDowngrade';

export default {
  title: 'Views/DidDowngrade',
  component: DidDowngrade,
} as Meta;

export function DidRefund() {
  return (
    <DidDowngrade
      identity={identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']}
    />
  );
}

export function W3NRefund() {
  return (
    <DidDowngrade
      identity={identities['4p273cfeZ2JRz46AcJoQvTRHCH8Vaj92jts2VxepZtQwbTBB']}
    />
  );
}

export function DidAndW3NRefund() {
  return (
    <DidDowngrade
      identity={identities['4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q']}
    />
  );
}

export function NoRefund() {
  return (
    <DidDowngrade
      identity={identities['4su6rRjEVPfNYCuaXw7iF3os1REHE6Gan23mYo2vc6fT7jZq']}
    />
  );
}
