import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
  mockRequestCredential,
  credentialsMock,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../../views/paths';

import { ShareCredentialCard } from './ShareCredentialCard';

import * as styles from './CredentialCard.module.css';

export default {
  title: 'Components/ShareCredentialCard',
  component: ShareCredentialCard,
} as Meta;

export function Selected(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <ul className={styles.credentialsList}>
        <ShareCredentialCard
          credential={credentialsMock[0]}
          identity={identitiesMock[0]}
          isSelected={true}
          onSelect={action('onSelect')}
        />
      </ul>
    </PopupTestProvider>
  );
}

export function NotSelected(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <ul className={styles.credentialsList}>
        <ShareCredentialCard
          credential={credentialsMock[0]}
          identity={identitiesMock[0]}
          isSelected={false}
          onSelect={action('onSelect')}
        />
      </ul>
    </PopupTestProvider>
  );
}

export function NotAttested(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <ul className={styles.credentialsList}>
        <ShareCredentialCard
          credential={credentialsMock[1]}
          identity={identitiesMock[0]}
          isSelected={true}
          onSelect={action('onSelect')}
        />
      </ul>
    </PopupTestProvider>
  );
}
