import { useCallback, useEffect, useState } from 'react';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './Balance.module.css';

import { KiltAmount } from '../KiltAmount/KiltAmount';
import { BalanceUpdateLink } from '../BalanceUpdateLink/BalanceUpdateLink';

import {
  BalanceChange,
  onAddressBalanceChange,
} from '../../utilities/balanceChanges/balanceChanges';

interface BalanceBN {
  transferable: BN;
  usableForFees: BN;
  bonded: BN;
  locked: BN;
  total: BN;
}

export function useAddressBalance(address: string): BalanceBN | null {
  const [balance, setBalance] = useState<BalanceBN | null>(null);

  useEffect(() => {
    setBalance(null);

    return onAddressBalanceChange(address, (error, output?: BalanceChange) => {
      if (error || !output) {
        console.error(error);
      } else {
        if (output.address === address) {
          setBalance(output.balances as BalanceBN);
        }
      }
    });
  }, [address]);

  return balance;
}

interface BalanceProps {
  address: string;
  breakdown?: boolean;
  smallDecimals?: boolean;
}

export function Balance({
  address,
  breakdown = false,
  smallDecimals = false,
}: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const balance = useAddressBalance(address);
  const connecting = balance === null;

  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleShowBreakdownClick = useCallback(async () => {
    setShowBreakdown(true);
  }, []);

  const handleHideBreakdownClick = useCallback(() => {
    setShowBreakdown(false);
  }, []);

  return (
    <>
      <p className={styles.balanceLine}>
        {connecting && <span className={styles.connecting}></span>}
        {t('component_Balance_label')}
        {!connecting && (
          <KiltAmount
            amount={balance.total}
            type="funds"
            smallDecimals={smallDecimals}
          />
        )}

        {breakdown &&
          !connecting &&
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
              onClick={handleShowBreakdownClick}
              className={styles.showBreakdown}
              title={t('component_Balance_showBreakdown')}
              aria-label={t('component_Balance_showBreakdown')}
            />
          ))}
      </p>
      {showBreakdown && !connecting && (
        <>
          <ul className={styles.breakdown}>
            <li className={styles.balance}>
              {t('component_Balance_transferable')}
              <KiltAmount amount={balance.transferable} type="funds" />
            </li>
            <li className={styles.balance}>
              {t('component_Balance_locked')}
              <KiltAmount amount={balance.locked} type="funds" />
            </li>
            <li className={styles.balance}>
              {t('component_Balance_bonded')}
              <KiltAmount amount={balance.bonded} type="funds" />
            </li>
          </ul>
          <BalanceUpdateLink address={address} />
        </>
      )}
    </>
  );
}
