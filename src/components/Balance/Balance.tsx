import { useEffect, useState } from 'react';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import { KiltAmount } from '../KiltAmount/KiltAmount';

interface BalanceProps {
  address: string;
}

export function Balance({ address }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const [balance, setBalance] = useState<BN | null>(null);

  function balanceListener(address: string, balance: BN) {
    setBalance(balance);
  }

  useEffect(() => {
    let unsubscribe: () => void;
    (async () => {
      unsubscribe = await listenToBalanceChanges(address, balanceListener);
    })();
    return () => {
      unsubscribe();
    };
  }, [address]);

  return (
    <span>
      {t('component_Balance_label')}

      {balance !== null && <KiltAmount amount={balance} />}

      {balance === null && <ClipLoader size={10} />}
    </span>
  );
}
