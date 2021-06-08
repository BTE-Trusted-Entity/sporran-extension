import { useCallback, useState, useEffect } from 'react';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { Account } from '../../utilities/accounts/types';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { AccountSlide } from '../../components/AccountSlide/AccountSlide';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { decryptAccount } from '../../utilities/accounts/accounts';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { generatePath, paths } from '../paths';
import {
  forgetPasswordChannel,
  getPasswordChannel,
  savePasswordChannel,
} from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels';

import styles from './ReviewTransaction.module.css';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';

interface Props {
  account: Account;
  recipient: string;
  amount: BN;
  fee: BN;
  tip: BN;
  onSuccess: (values: { password: string }) => void;
  txPending: boolean;
  txModalOpen: boolean;
  handleCloseTxModal: () => void;
}

export function ReviewTransaction({
  account,
  recipient,
  amount,
  fee,
  tip,
  onSuccess,
  txPending,
  txModalOpen,
  handleCloseTxModal,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { passwordType, passwordToggle } = usePasswordType();
  const [showDetails, setShowDetails] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleShowDetailsClick = useCallback(() => {
    setShowDetails(true);
  }, []);

  const handleHideDetailsClick = useCallback(() => {
    setShowDetails(false);
  }, []);

  const [savedPassword, setSavedPassword] = useState<string | undefined>();

  const [remember, setRemember] = useState(false);

  const toggleRemember = useCallback(() => {
    setRemember(!remember);
  }, [remember]);

  const handlePasswordInput = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    (async () => {
      const password = await getPasswordChannel.get(account.address);
      setSavedPassword(password);
      setRemember(Boolean(password));
    })();
  }, [account]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      setSubmitting(true);

      const { elements } = event.target;
      const providedPassword = elements.password.value;
      const password =
        providedPassword === '************' && savedPassword
          ? savedPassword
          : providedPassword;

      try {
        await decryptAccount(account.address, password);

        if (remember) {
          await savePasswordChannel.get({ password, address: account.address });
        } else {
          await forgetPasswordChannel.get(account.address);
        }

        onSuccess({ password });
      } catch (error) {
        setError(t('view_ReviewTransaction_password_incorrect'));
        setSubmitting(false);
      }
    },
    [t, account, savedPassword, onSuccess, remember],
  );

  const totalFee = fee.add(tip);
  const total = amount.add(totalFee);

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_ReviewTransaction_heading')}</h1>
      <p className={styles.subline}>{t('view_ReviewTransaction_subline')}</p>

      <AccountSlide account={account} />

      <p className={styles.recipient}>
        {t('view_ReviewTransaction_recipient')}
      </p>
      <p className={styles.address}>{recipient}</p>

      <p className={styles.totalLine}>
        <span>{t('view_ReviewTransaction_total')}</span>
        <KiltAmount amount={total} type="costs" />

        {showDetails ? (
          <button
            onClick={handleHideDetailsClick}
            type="button"
            className={styles.hideDetails}
            title={t('view_ReviewTransaction_hideDetails')}
            aria-label={t('view_ReviewTransaction_hideDetails')}
          />
        ) : (
          <button
            onClick={handleShowDetailsClick}
            type="button"
            className={styles.showDetails}
            title={t('view_ReviewTransaction_showDetails')}
            aria-label={t('view_ReviewTransaction_showDetails')}
          />
        )}
      </p>

      <table className={showDetails ? styles.details : styles.detailsHidden}>
        <thead>
          <tr>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_fee')}
            </th>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_tip')}
            </th>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_totalFee')}
            </th>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_amount')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <KiltAmount amount={fee} type="costs" />
            </td>
            <td>
              <KiltAmount amount={tip} type="costs" />
            </td>
            <td>
              <KiltAmount amount={totalFee} type="costs" />
            </td>
            <td>
              <KiltAmount amount={amount} type="funds" />
            </td>
          </tr>
        </tbody>
      </table>

      <p className={styles.resetLine}>
        <label className={styles.passwordLabel} htmlFor="password">
          {t('view_ReviewTransaction_password')}
        </label>

        <Link
          to={generatePath(paths.account.reset.start, {
            address: account.address,
          })}
          className={styles.reset}
        >
          {t('view_ReviewTransaction_reset')}
        </Link>
      </p>

      <p className={styles.passwordLine}>
        <input
          type={passwordType}
          onInput={handlePasswordInput}
          id="password"
          name="password"
          className={styles.password}
          defaultValue={savedPassword ? '************' : undefined}
          autoFocus
        />
        {passwordToggle}

        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>

      <label className={styles.rememberLabel}>
        <span>{t('view_ReviewTransaction_remember')}</span>
        <input
          type="checkbox"
          name="remember"
          className={styles.remember}
          checked={remember}
          onChange={toggleRemember}
        />
        <span />
      </label>

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {t('view_ReviewTransaction_CTA')}
        </button>
      </p>

      <LinkBack />
      <Stats />
      {txModalOpen && (
        <TxStatusModal
          account={account}
          pending={txPending}
          handleClose={handleCloseTxModal}
        />
      )}
    </form>
  );
}
