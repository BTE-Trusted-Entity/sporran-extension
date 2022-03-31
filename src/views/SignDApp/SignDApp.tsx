import { Fragment, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './SignDApp.module.css';

import { useIdentities } from '../../utilities/identities/identities';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { Avatar } from '../../components/Avatar/Avatar';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignChannel } from '../../dApps/SignChannels/backgroundSignChannel';
import { SignOriginInput } from '../../dApps/SignChannels/types';

import { getExtrinsic, useExtrinsicValues } from './useExtrinsicValues';

export function SignDApp(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const input = usePopupData<SignOriginInput>();
  const values = useExtrinsicValues(input);

  const passwordField = usePasswordField();

  const identities = useIdentities().data;
  const identity = identities && identities[input.address as string];

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!identity) {
        return;
      }

      const { id } = input;
      const { keypair } = await passwordField.get(event);

      const extrinsic = await getExtrinsic(input);
      const { signature } = extrinsic.sign(keypair);

      await backgroundSignChannel.return({ signature, id });

      window.close();
    },
    [input, identity, passwordField],
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

      <CopyValue
        value={identity.address}
        label={identity.name}
        className={styles.addressLine}
      />

      <dl className={styles.details}>
        {values.map(({ label, value, details }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd
              className={styles.detailValue}
              title={!details ? String(value) : undefined}
            >
              {!details ? (
                value
              ) : (
                <details>
                  <summary>{value}</summary>
                  {details}
                </details>
              )}
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
