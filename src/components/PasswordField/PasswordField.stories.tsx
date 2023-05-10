import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { PasswordField, usePasswordField } from './PasswordField';

export default {
  title: 'Components/PasswordField',
  component: PasswordField,
} as Meta;

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

export function Template(): JSX.Element {
  const passwordField = usePasswordField();
  return (
    <form>
      <PasswordField identity={identity} password={passwordField} />
    </form>
  );
}
