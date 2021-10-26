import { useCallback, useRef } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { getIdentityDidCrypto } from '../../utilities/identities/identities';
import { isFullDid } from '../../utilities/did/did';

import { useCopyButton } from '../../components/useCopyButton/useCopyButton';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignDidChannel } from '../../channels/SignDidChannels/backgroundSignDidChannel';
import { SignDidPopupInput } from '../../channels/SignDidChannels/types';

import * as styles from './SignDid.module.css';

interface Props {
  identity: Identity;
}

export function SignDid({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const error = !isFullDid(identity.did);

  const { origin, plaintext } = usePopupData<SignDidPopupInput>();

  const plaintextRef = useRef<HTMLTextAreaElement>(null);
  const copy = useCopyButton(plaintextRef);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { address, did } = identity;
      const password = await passwordField.get(event);
      const { sign } = await getIdentityDidCrypto(address, password);

      const signature = sign(plaintext);
      await backgroundSignDidChannel.return({ signature, did });

      window.close();
    },
    [identity, passwordField, plaintext],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidChannel.throw('Rejected');
    window.close();
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignDid_title')}</h1>
      <p className={styles.subline}>{t('view_SignDid_subline')}</p>

      <IdentitiesCarousel identity={identity} />

      <p className={styles.label}>{t('view_SignDid_origin')}</p>
      <p className={styles.origin}>{origin}</p>

      <p className={styles.label} id="plaintext">
        {t('view_SignDid_plaintext')}
      </p>
      <p className={styles.plaintextLine}>
        <textarea
          className={styles.plaintext}
          readOnly
          aria-labelledby="plaintext"
          value={plaintext}
          ref={plaintextRef}
        />
        {copy.supported && (
          <button
            className={copy.className}
            onClick={copy.handleCopyClick}
            type="button"
            aria-label={copy.title}
            title={copy.title}
          />
        )}
      </p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignDid_reject')}
        </button>
        <button type="submit" className={styles.submit} disabled={error}>
          {t('view_SignDid_CTA')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {t('view_SignDid_error')}
        </output>
      </p>
    </form>
  );
}
