import { Fragment, useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { minBy } from 'lodash-es';
import BN from 'bn.js';

import { Identity, useIdentities } from '../../utilities/identities/identities';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { useQuery } from '../../utilities/useQuery/useQuery';
import { backgroundClaimChannel } from '../../channels/ClaimChannels/browserClaimChannels';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { Avatar } from '../../components/Avatar/Avatar';

import styles from './SignQuote.module.css';

export function SignQuote(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const costs = new BN(0);

  const values = [...Object.entries(useQuery())];

  const { passwordType, passwordToggle } = usePasswordType();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleNameInput = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const handlePasswordInput = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  const handleCancel = useCallback(() => {
    window.close();
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    await backgroundClaimChannel.return({});
    window.close();
  }, []);

  const identities = useIdentities().data;
  if (!identities) {
    return null; // storage data pending
  }

  const firstIdentity = minBy(Object.values(identities), 'index') as Identity;

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_SignQuote_heading')}</h1>

      <dl className={styles.details}>
        {values.map(([name, value]) => (
          <Fragment key={name}>
            <dt className={styles.detailName}>{name}:</dt>
            <dd className={styles.detailValue}>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <p className={styles.costs}>
        <span>{t('view_SignQuote_costs')}</span>
        <KiltAmount amount={costs} type="costs" smallDecimals />
      </p>

      <label className={styles.label}>
        {t('view_SignQuote_name')}
        <input
          name="name"
          className={styles.name}
          required
          onInput={handleNameInput}
          autoComplete="off"
          autoFocus
        />
      </label>

      <div className={styles.identity}>
        <Avatar address={firstIdentity.address} className={styles.avatar} />
        <span className={styles.identityName}>{firstIdentity.name}</span>
      </div>

      <label className={styles.label}>
        {t('view_SignQuote_password')}
        <span className={styles.passwordLine}>
          <input
            name="password"
            type={passwordType}
            className={styles.password}
            required
            onInput={handlePasswordInput}
          />
          {passwordToggle}
        </span>
      </label>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={!name || !password}
        >
          {t('view_SignQuote_CTA')}
        </button>
      </p>
    </form>
  );
}
