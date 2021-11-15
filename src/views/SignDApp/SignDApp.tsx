import { Fragment, useCallback, useRef } from 'react';
import { browser } from 'webextension-polyfill-ts';

import { useIdentities } from '../../utilities/identities/identities';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { Avatar } from '../../components/Avatar/Avatar';
import { useCopyButton } from '../../components/useCopyButton/useCopyButton';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignChannel } from '../../dApps/SignChannels/backgroundSignChannel';

import * as styles from './SignDApp.module.css';

export interface ExtrinsicData {
  origin: string;
  address: string;
  specVersion: number;
  nonce: number;
  method: string;
  lifetimeStart?: number;
  lifetimeEnd?: number;
}

function formatBlock(block: number) {
  const locale = browser.i18n.getUILanguage();
  const formatter = new Intl.NumberFormat(locale, { useGrouping: true });
  return formatter.format(block);
}

function getExtrinsicValues({
  origin,
  specVersion,
  nonce,
  method,
  lifetimeStart,
  lifetimeEnd,
}: ExtrinsicData) {
  const t = browser.i18n.getMessage;

  const lifetime =
    lifetimeStart && lifetimeEnd
      ? t('view_SignDApp_mortal', [
          formatBlock(lifetimeStart),
          formatBlock(lifetimeEnd),
        ])
      : t('view_SignDApp_immortal');

  return [
    { value: origin, label: t('view_SignDApp_from') },
    { value: specVersion, label: t('view_SignDApp_version') },
    { value: nonce, label: t('view_SignDApp_nonce') },
    { value: method, label: t('view_SignDApp_method') },
    { value: lifetime, label: t('view_SignDApp_lifetime') },
  ];
}

export function SignDApp(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const data = usePopupData<ExtrinsicData>();
  const values = getExtrinsicValues(data);

  const addressRef = useRef<HTMLInputElement>(null);
  const copy = useCopyButton(addressRef);

  const passwordField = usePasswordField();

  const identities = useIdentities().data;
  const identity = identities && identities[data.address as string];

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!identity) {
        return;
      }

      const password = await passwordField.get(event);
      await backgroundSignChannel.return(password);

      window.close();
    },
    [identity, passwordField],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignChannel.throw('Rejected');
    window.close();
  }, []);

  if (!identity) {
    return null; // TODO: what to show when the user has no identities?
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignDApp_title')}</h1>

      <Avatar identity={identity} className={styles.avatar} />
      <h2 className={styles.identity}>{identity.name}</h2>

      <p className={styles.addressLine}>
        <input
          className={styles.address}
          ref={addressRef}
          readOnly
          value={identity.address}
          aria-label={identity.name}
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

      <dl className={styles.details}>
        {values.map(({ label, value }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd className={styles.detailValue} title={String(value)}>
              {value}
            </dd>
          </Fragment>
        ))}
      </dl>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignDApp_reject')}
        </button>
        <button type="submit" className={styles.submit}>
          {t('view_SignDApp_CTA')}
        </button>
      </p>
    </form>
  );
}
