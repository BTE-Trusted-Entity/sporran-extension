import { browser } from 'webextension-polyfill-ts';

import { Link } from 'react-router-dom';

import { filter } from 'lodash-es';

import { useEffect } from 'react';

import * as styles from './SignDidStart.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { generatePath, paths } from '../paths';
import { isFullDid } from '../../utilities/did/did';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';

interface Props {
  identity: Identity;
  onPopupData: (popupData: SignDidOriginInput) => void;
  resetCredentials: () => void;
}

export function SignDidStart({
  identity,
  onPopupData,
  resetCredentials,
}: Props) {
  const t = browser.i18n.getMessage;

  useEffect(() => resetCredentials, [resetCredentials]);

  const popupData = usePopupData<SignDidOriginInput>();
  useEffect(() => {
    onPopupData(popupData);
  }, [popupData, onPopupData]);

  const { address, did } = identity;

  const credentials = useIdentityCredentials(did);

  const attestedCredentials = filter(
    credentials,
    ({ status }) => status === 'attested' || status === 'pending',
  );

  const errorDid = !isFullDid(did) && t('view_SignDidStart_error_did');
  const errorCredentials = [
    errorDid,
    !attestedCredentials?.length && t('view_SignDidStart_error_credentials'),
  ].filter(Boolean)[0];

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_SignDidStart_title')}</h1>
      <p className={styles.subline}>{t('view_SignDidStart_subline')}</p>

      <IdentitiesCarousel identity={identity} />

      <div className={styles.infoWrapper}>
        <p className={styles.info}>{t('view_SignDidStart_info_did')}</p>
        <p className={styles.info}>{t('view_SignDidStart_info_credentials')}</p>
      </div>

      <Link
        onClick={(event) => errorCredentials && event.preventDefault()}
        to={generatePath(paths.popup.signDid.credentials, {
          address,
        })}
        className={styles.withCredentials}
        aria-disabled={Boolean(errorCredentials)}
        title={errorCredentials || undefined}
        aria-label={errorCredentials || undefined}
      >
        {t('view_SignDidStart_with_credentials')}
      </Link>

      <Link
        onClick={(event) => errorDid && event.preventDefault()}
        to={generatePath(paths.popup.signDid.sign, { address })}
        className={styles.withoutCredentials}
        aria-disabled={Boolean(errorDid)}
        title={errorDid || undefined}
        aria-label={errorDid || undefined}
      >
        {t('view_SignDidStart_without_credentials')}
      </Link>
    </section>
  );
}
