import { Meta } from '@storybook/react';

import { CreateAccountSuccess } from './CreateAccountSuccess';

export default {
  title: 'Views/CreateAccountSuccess',
  component: CreateAccountSuccess,
} as Meta;

export function Create(): JSX.Element {
  return <CreateAccountSuccess />;
}

export function Import(): JSX.Element {
  return <CreateAccountSuccess type="import" />;
}
