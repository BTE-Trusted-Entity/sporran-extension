import { useCallback, useEffect, useState } from 'react';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import {
  BalanceChangeResponse,
  onBalanceChangeResponse,
  sendBalanceChangeRequest,
} from '../../connection/BalanceMessages/BalanceMessages';
import { KiltAmount } from '../KiltAmount/KiltAmount';

import styles from './Balance.module.css';

interface BalanceBN {
  free: BN;
  bonded: BN;
  locked: BN;
  total: BN;
}

export function useAddressBalance(address: string): BalanceBN | null {
  const [balance, setBalance] = useState<BalanceBN | null>(null);

  const balanceListener = useCallback(
    async (data: BalanceChangeResponse) => {
      if (data.address === address) {
        const { free, bonded, locked, total } = data.balance;
        const balanceBN = {
          free: new BN(free),
          bonded: new BN(bonded),
          locked: new BN(locked),
          total: new BN(total),
        };
        setBalance(balanceBN);
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

interface BalanceProps {
  address: string;
  breakdown?: boolean;
}

export function Balance({ address, breakdown }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const balance = useAddressBalance(address);

  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleshowBreakdownClick = useCallback(() => {
    setShowBreakdown(true);
  }, []);

  const handleHideBreakdownClick = useCallback(() => {
    setShowBreakdown(false);
  }, []);

  return (
    <>
      <p className={styles.balanceLine}>
        {t('component_Balance_label')}
        {balance !== null && <KiltAmount amount={balance.total} />}

        {balance === null && <ClipLoader size={10} />}

        {breakdown &&
          balance !== null &&
          (showBreakdown ? (
            <button
              type="button"
              onClick={handleHideBreakdownClick}
              className={styles.hideBreakdown}
              title={t('component_Balance_hideBreakdown')}
              aria-label={t('component_Balance_hideBreakdown')}
            />
          ) : (
            <button
              type="button"
              onClick={handleshowBreakdownClick}
              className={styles.showBreakdown}
              title={t('component_Balance_showBreakdown')}
              aria-label={t('component_Balance_showBreakdown')}
            />
          ))}
      </p>
      {showBreakdown && balance !== null && (
        <ul className={styles.breakdown}>
          <li className={styles.balance}>
            {t('component_Balance_free')}
            <KiltAmount amount={balance.free} />
          </li>
          <li className={styles.balance}>
            {t('component_Balance_locked')}
            <KiltAmount amount={balance.locked} />
          </li>
          <li className={styles.balance}>
            {t('component_Balance_bonded')}
            <KiltAmount amount={balance.bonded} />
          </li>
        </ul>
      )}
    </>
  );
}
