import { useEffect, useState } from 'react';
import { listenToBalanceChanges } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';

const KILT_FEMTO_COIN = new BN(1e15);

function asKiltCoins(balance: BN): string {
  return balance.div(KILT_FEMTO_COIN).toNumber() + ' K';
}

interface BalanceProps {
  address: string;
}

export function Balance({ address }: BalanceProps): JSX.Element {
  const [balance, setBalance] = useState('');

  function balanceListener(address: string, balance: BN, change: BN) {
    console.log('Balance: ', BN);
    console.log('Balance changed by ', asKiltCoins(change));
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

  return <div>Balance: {balance || <ClipLoader size={10} />}</div>;
}
