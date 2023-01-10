import { Meta } from '@storybook/react';

import * as styles from './CredentialCard.module.css';

import {
  credentialsMock,
  notDownloaded,
} from '../../utilities/credentials/CredentialsProvider.mock';

import { CredentialCard } from './CredentialCard';

export default {
  title: 'Components/CredentialCard',
  component: CredentialCard,
} as Meta;

export function Template(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard sporranCredential={credentialsMock[0]} />
    </ul>
  );
}

export function DownloadPrompt(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard sporranCredential={notDownloaded[0]} />
    </ul>
  );
}

export function Expanded(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard expand sporranCredential={notDownloaded[0]} />
    </ul>
  );
}

export function Revoked(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard expand sporranCredential={credentialsMock[2]} />
    </ul>
  );
}
