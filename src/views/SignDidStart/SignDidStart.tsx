import browser from 'webextension-polyfill';

import { Link } from 'react-router-dom';

import { useEffect } from 'react';

import * as styles from './SignDidStart.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { generatePath, paths } from '../paths';
import { isFullDid } from '../../utilities/did/did';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';

interface Props {
  popupData: SignDidOriginInput;
  identity: Identity;
  resetCredentials: () => void;
}

export function SignDidStart({ popupData, identity, resetCredentials }: Props) {
  const t = browser.i18n.getMessage;

  useEffect(() => resetCredentials, [resetCredentials]);

  const { didUri } = popupData;
  const { address, did } = identity;

  const sporranCredentials = useIdentityCredentials(did);

  const noAttestedCredentials = !sporranCredentials?.some(
    ({ status }) => status === 'attested' || status === 'pending',
  );

  const errorDid = !isFullDid(did) && t('view_SignDidStart_error_did');
  const errorUnattested =
    noAttestedCredentials && t('view_SignDidStart_error_credentials');
  const errorCredentials = [errorDid, errorUnattested].filter(Boolean)[0];

  const identityIsPredetermined = did && did === didUri;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_SignDidStart_title')}</h1>
      <p className={styles.subline}>{t('view_SignDidStart_subline')}</p>

      {identityIsPredetermined ? (
        <IdentitySlide identity={identity} />
      ) : (
        <IdentitiesCarousel identity={identity} />
      )}

      <div className={styles.infoWrapper}>
        <p className={styles.info}>{t('view_SignDidStart_info_did')}</p>
        <p className={styles.info}>{t('view_SignDidStart_info_credentials')}</p>
      </div>

      <Link
        onClick={(event) => errorCredentials && event.preventDefault()}
        to={generatePath(paths.popup.signDid.credentials, {
          address,
        })}
        className={styles.next}
        aria-disabled={Boolean(errorCredentials)}
        title={errorCredentials || undefined}
        aria-label={errorCredentials || undefined}
      >
        {t('view_SignDidStart_with_credentials')}
      </Link>

      <Link
        onClick={(event) => errorDid && event.preventDefault()}
        to={generatePath(paths.popup.signDid.sign, { address })}
        className={styles.next}
        aria-disabled={Boolean(errorDid)}
        title={errorDid || undefined}
        aria-label={errorDid || undefined}
      >
        {t('view_SignDidStart_without_credentials')}
      </Link>
    </section>
  );
}
