import { Meta } from '@storybook/react';

import { CreateAccountSuccess } from './CreateAccountSuccess';

export default {
  title: 'Views/CreateAccountSuccess',
  component: CreateAccountSuccess,
} as Meta;

export function Create(): JSX.Element {
  return (
    <CreateAccountSuccess address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire" />
  );
}

export function Import(): JSX.Element {
  return (
    <CreateAccountSuccess
      type="import"
      address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
    />
  );
}

export function Reset(): JSX.Element {
  return (
    <CreateAccountSuccess
      type="reset"
      address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
    />
  );
}
