import { useEffect, useState } from 'react';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';
import { browser } from 'webextension-polyfill-ts';

import { KiltCurrency } from '../KiltCurrency/KiltCurrency';

const KILT_FEMTO_COIN = new BN(1e15);

const FORMAT = {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
};

function asKiltCoins(balance: BN): string {
  return balance
    .div(KILT_FEMTO_COIN)
    .toNumber()
    .toLocaleString(browser.i18n.getUILanguage(), FORMAT);
}

interface BalanceProps {
  address: string;
}

export function Balance({ address }: BalanceProps): JSX.Element {
  const t = browser.i18n.getMessage;
  const [balance, setBalance] = useState<string | null>(null);

  function balanceListener(address: string, balance: BN) {
    setBalance(asKiltCoins(balance));
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

      {balance !== null && (
        <>
          {balance} <KiltCurrency />
        </>
      )}

      {balance === null && <ClipLoader size={10} />}
    </span>
  );
}
