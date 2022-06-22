import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { find } from 'lodash-es';

import * as styles from './CreatePresentation.module.css';

import { Identity } from '../../utilities/identities/types';
import {
  getUnsignedPresentationDownload,
  useIdentityCredentials,
} from '../../utilities/credentials/credentials';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { PresentCredentialCard } from '../../components/CredentialCard/PresentCredentialCard';

interface Props {
  identity: Identity;
}

export function CreatePresentation({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { goBack } = useHistory();
  const params = useParams() as { hash: string };
  const rootHash = params.hash;

  const credentials = useIdentityCredentials(identity.did);
  const credential = find(credentials, { request: { rootHash } });
  const [checked, setChecked] = useState<string[]>([]);

  if (!credentials) {
    return null; // storage data pending
  }

  if (!credential) {
    throw new Error(`Credential not found: ${rootHash}`);
  }

  const { name, url } = getUnsignedPresentationDownload(credential, checked);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_CreatePresentation_title')}</h1>
      <p className={styles.subline}>{t('view_CreatePresentation_subline')}</p>

      <div className={styles.credentialContainer}>
        <PresentCredentialCard credential={credential} onSelect={setChecked} />
      </div>

      <p className={styles.buttonsLine}>
        <button onClick={goBack} className={styles.cancel}>
          {t('common_action_cancel')}
        </button>
        <a download={name} href={url} className={styles.download}>
          {t('view_CreatePresentation_download')}
        </a>
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
