import { Meta } from '@storybook/react';

import { usePasswordType } from './usePasswordType';

export default {
  title: 'components/usePasswordType',
} as Meta;

export function Template() {
  const { passwordType, passwordToggle } = usePasswordType();
  return (
    <form>
      <input type={passwordType} />
      {passwordToggle}
    </form>
  );
}
