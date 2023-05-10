import { Meta } from '@storybook/react';
import { JSX } from 'react';
import { action } from '@storybook/addon-actions';

import * as styles from './CredentialCard.module.css';

import {
  mockRequestCredential,
  credentialsMock,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../../views/paths';

import { ShareCredentialCard } from './ShareCredentialCard';

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
          sporranCredential={credentialsMock[0]}
          identity={identitiesMock[0]}
          isSelected
          onSelect={action('onSelect')}
          viewRef={{ current: null }}
          expand={false}
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
          sporranCredential={credentialsMock[0]}
          identity={identitiesMock[0]}
          onSelect={action('onSelect')}
          viewRef={{ current: null }}
          expand={false}
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
          sporranCredential={credentialsMock[1]}
          identity={identitiesMock[0]}
          isSelected
          onSelect={action('onSelect')}
          viewRef={{ current: null }}
          expand={false}
        />
      </ul>
    </PopupTestProvider>
  );
}
