import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { action } from '@storybook/addon-actions';

import * as menuStyles from '../Menu/Menu.module.css';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { IdentityOptions } from './IdentityOptions';

export default {
  title: 'Components/IdentityOptions',
  component: IdentityOptions,
  decorators: [
    (Story) => (
      <div className={menuStyles.wrapper} style={{ float: 'right' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export function Template(): JSX.Element {
  return (
    <IdentityOptions
      onEdit={action('onEdit')}
      identity={
        identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
      }
    />
  );
}
