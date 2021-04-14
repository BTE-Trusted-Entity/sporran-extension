import { useCallback, useEffect, useState } from 'react';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import {
  BalanceChangeResponse,
  BalanceChangeRequest,
  MessageType,
} from '../../connection/MessageType';
import { KiltAmount } from '../KiltAmount/KiltAmount';

import styles from './Balance.module.css';

interface BalanceProps {
  address: string;
}

export function Balance({ address }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const [balance, setBalance] = useState<BN | null>(null);

  const balanceListener = useCallback(
    (message: BalanceChangeResponse) => {
      if (
        message.type === MessageType.balanceChangeResponse &&
        message.data.address === address
      ) {
        setBalance(new BN(message.data.balance, 16));
      }
    },
    [address],
  );

  useEffect(() => {
    browser.runtime.onMessage.addListener(balanceListener);
    browser.runtime.sendMessage({
      type: MessageType.balanceChangeRequest,
      data: { address },
    } as BalanceChangeRequest);

    return () => {
      browser.runtime.onMessage.removeListener(balanceListener);
    };
  }, [address, balanceListener]);

  return (
    <>
      <span className={styles.balanceLabel}>
        {t('component_Balance_label')}
      </span>
      {balance !== null && <KiltAmount amount={balance} />}

      {balance === null && <ClipLoader size={10} />}
    </>
  );
}
