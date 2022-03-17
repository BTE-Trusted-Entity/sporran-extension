import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { W3NCreateForm } from './W3NCreateForm';

export default {
  title: 'Views/W3NCreateForm',
  component: W3NCreateForm,
} as Meta;

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

export function Template(): JSX.Element {
  return <W3NCreateForm identity={identity} onSubmit={action('onSubmit')} />;
}
