import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import * as styles from './CredentialCard.module.css';

import {
  credentialsMock,
  mockRequestCredential,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { paths } from '../../views/paths';

import { SignDidCredentialCard } from './SignDidCredentialCard';

export default {
  title: 'Components/SignDidCredentialCard',
  component: SignDidCredentialCard,
} as Meta;

export function Selected() {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <ul className={styles.credentialsList}>
        <SignDidCredentialCard
          sporranCredential={credentialsMock[0]}
          onSelect={action('onSelect')}
          onUnSelect={action('onUnSelect')}
          viewRef={{ current: null }}
        />
      </ul>
    </PopupTestProvider>
  );
}

export function NotAttested() {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <ul className={styles.credentialsList}>
        <SignDidCredentialCard
          sporranCredential={credentialsMock[1]}
          onSelect={action('onSelect')}
          onUnSelect={action('onUnSelect')}
          viewRef={{ current: null }}
        />
      </ul>
    </PopupTestProvider>
  );
}
