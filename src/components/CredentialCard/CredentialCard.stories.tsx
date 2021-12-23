import { Meta } from '@storybook/react';

import * as styles from './CredentialCard.module.css';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { CredentialCard } from './CredentialCard';

export default {
  title: 'Components/CredentialCard',
  component: CredentialCard,
} as Meta;

export function Template(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard credential={credentialsMock[0]} />
    </ul>
  );
}
