import { useCallback, useEffect, useState } from 'react';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import {
  ComputedBalance,
  BalanceChangeResponse,
  onBalanceChangeResponse,
  sendBalanceChangeRequest,
} from '../../connection/BalanceMessages/BalanceMessages';
import { KiltAmount } from '../KiltAmount/KiltAmount';

import styles from './Balance.module.css';

interface BalanceProps {
  address: string;
  breakdown?: boolean;
}

export function useAddressBalance(address: string): ComputedBalance | null {
  const [balance, setBalance] = useState<ComputedBalance | null>(null);

  const balanceListener = useCallback(
    async (data: BalanceChangeResponse) => {
      if (data.address === address) {
        setBalance(data.balance);
      }
    },
    [address],
  );

  useEffect(() => {
    const removeListener = onBalanceChangeResponse(balanceListener);
    sendBalanceChangeRequest(address);
    return removeListener;
  }, [address, balanceListener]);

  return balance;
}

export function Balance({ address, breakdown }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const balance = useAddressBalance(address);

  const [showBalanceBreakdown, setShowBalanceBreakdown] = useState(false);

  const handleshowBalanceBreakdownClick = useCallback(() => {
    setShowBalanceBreakdown(true);
  }, []);

  const handleHideBalanceBreakdownClick = useCallback(() => {
    setShowBalanceBreakdown(false);
  }, []);

  return (
    <>
      <p className={styles.balance}>
        {t('component_Balance_label')}
        {balance !== null && <KiltAmount amount={new BN(balance.total)} />}

        {balance === null && <ClipLoader size={10} />}

        {breakdown &&
          (showBalanceBreakdown ? (
            <button
              type="button"
              onClick={handleHideBalanceBreakdownClick}
              className={styles.hideBalanceBreakdown}
              title={t('component_Balance_hideBalanceBreakdown')}
              aria-label={t('component_Balance_hideBalanceBreakdown')}
            />
          ) : (
            <button
              type="button"
              onClick={handleshowBalanceBreakdownClick}
              className={styles.showBalanceBreakdown}
              title={t('component_Balance_showBalanceBreakdown')}
              aria-label={t('component_Balance_showBalanceBreakdown')}
            />
          ))}
      </p>
      {showBalanceBreakdown && balance !== null && (
        <ul className={styles.balanceBreakdown}>
          <li>
            {t('component_Balance_balance_free')}
            <KiltAmount amount={new BN(balance.free)} />
          </li>
          <li>
            {t('component_Balance_balance_locked')}
            <KiltAmount amount={new BN(balance.locked)} />
          </li>
          <li>
            {t('component_Balance_balance_bonded')}
            <KiltAmount amount={new BN(balance.bonded)} />
          </li>
        </ul>
      )}
    </>
  );
}
