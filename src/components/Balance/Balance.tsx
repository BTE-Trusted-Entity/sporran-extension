import { useEffect, useState } from 'react';
import {
  getBalance,
  listenToBalanceChanges,
} from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';
import { ClipLoader } from 'react-spinners';

const KILT_FEMTO_COIN = 1e15; // or 1_000_000_000_000_000

interface BalanceProps {
  address: string;
}

export function Balance({ address }: BalanceProps): JSX.Element {
  const [balance, setBalance] = useState('');

  function asKiltCoins(balance: BN): string {
    return balance.div(new BN(KILT_FEMTO_COIN)).toNumber().toFixed(2) + ' K';
  }

  function balanceListener(address: string, balance: BN, change: BN) {
    console.log('Balance changed by ', asKiltCoins(change));
    setBalance(asKiltCoins(balance));
  }

  useEffect(() => {
    let unsubscribe: () => void;
    (async () => {
      // listen for balance changes
      unsubscribe = await listenToBalanceChanges(address, balanceListener);
      // get balance
      const balanceRaw = await getBalance(address);
      setBalance(asKiltCoins(balanceRaw));
    })();
    // stop listening on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  return <div>Balance: {balance ? balance : <ClipLoader size={10} />}</div>;
}
