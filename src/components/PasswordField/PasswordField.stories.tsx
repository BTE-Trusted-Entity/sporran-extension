import { Meta } from '@storybook/react';

import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

import { PasswordField, usePasswordField } from './PasswordField';

export default {
  title: 'Components/PasswordField',
  component: PasswordField,
} as Meta;

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  const passwordField = usePasswordField();
  return (
    <form>
      <PasswordField account={account} password={passwordField} />
    </form>
  );
}
