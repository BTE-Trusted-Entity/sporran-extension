import { Fragment, useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { minBy } from 'lodash-es';
import BN from 'bn.js';

import { Account, useAccounts } from '../../utilities/accounts/accounts';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { useQuery } from '../../utilities/useQuery/useQuery';
import { MessageType } from '../../connection/MessageType';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { Avatar } from '../../components/Avatar/Avatar';

import styles from './SignQuote.module.css';

async function sendPopupResponse(data: { [key: string]: string }) {
  await browser.runtime.sendMessage({
    type: MessageType.popupResponse,
    data,
  });
}

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

    await sendPopupResponse({});
    window.close();
  }, []);

  const accounts = useAccounts().data;
  if (!accounts) {
    return null;
  }

  const firstAccount = minBy(Object.values(accounts), 'index') as Account;

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_SignQuote_heading')}</h1>
      <p className={styles.subline}>{t('view_SignQuote_subline')}</p>

      <dl className={styles.details}>
        {values.map(([name, value], index) => (
          <Fragment key={name}>
            <dt className={styles.detailName}>{name}:</dt>
            <dd
              className={index < 2 ? styles.detailOwnValue : styles.detailValue}
            >
              {value}
            </dd>
          </Fragment>
        ))}
      </dl>

      <p className={styles.costs}>
        <span>{t('view_SignQuote_costs')}</span>
        <KiltAmount amount={costs} />
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

      <div className={styles.account}>
        <Avatar
          tartan={firstAccount.tartan}
          address={firstAccount.address}
          className={styles.tartan}
        />
        <span>{firstAccount.name}</span>
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
