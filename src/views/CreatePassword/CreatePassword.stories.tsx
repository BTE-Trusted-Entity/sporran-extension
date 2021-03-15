import { Meta } from '@storybook/react';
import { CreatePassword } from './CreatePassword';

export default {
  title: 'Views/CreatePassword',
  component: CreatePassword,
} as Meta;

export function Template(): JSX.Element {
  return (
    <CreatePassword backupPhrase="one two three four five six seven eight nine ten eleven twelve" />
  );
}
