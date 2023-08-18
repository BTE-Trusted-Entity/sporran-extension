import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import * as styles from './CredentialCard.module.css';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { PresentCredentialCard } from './PresentCredentialCard';

export default {
  title: 'Components/PresentCredentialCard',
  component: PresentCredentialCard,
} as Meta;

export function Template() {
  return (
    <div className={styles.credentialsList}>
      <PresentCredentialCard
        sporranCredential={credentialsMock[0]}
        onSelect={action('onSelect')}
      />
    </div>
  );
}
