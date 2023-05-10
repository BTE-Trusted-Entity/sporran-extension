import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreateForm } from './W3NCreateForm';

export default {
  title: 'Views/W3NCreateForm',
  component: W3NCreateForm,
} as Meta;

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

export function Template(): JSX.Element {
  return <W3NCreateForm identity={identity} />;
}
