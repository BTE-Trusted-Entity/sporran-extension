import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import menuStyles from '../Menu/Menu.module.css';

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
        identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
      }
    />
  );
}

export function WithFullDid(): JSX.Element {
  return (
    <IdentityOptions
      onEdit={action('onEdit')}
      identity={
        identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
      }
    />
  );
}
