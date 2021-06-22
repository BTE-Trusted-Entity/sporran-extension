import { Meta } from '@storybook/react';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { PasswordField, usePasswordField } from './PasswordField';

export default {
  title: 'Components/PasswordField',
  component: PasswordField,
} as Meta;

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  const passwordField = usePasswordField();
  return (
    <form>
      <PasswordField identity={identity} password={passwordField} />
    </form>
  );
}
