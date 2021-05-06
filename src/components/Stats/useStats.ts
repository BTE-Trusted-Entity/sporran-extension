import { useEffect, useRef, useState } from 'react';
import BN from 'bn.js';
import { find, mapValues, omit } from 'lodash-es';

import { AccountsMap } from '../../utilities/accounts/accounts';
import {
  BalanceChangeResponse,
  onBalanceChangeResponse,
  sendBalanceChangeRequest,
} from '../../connection/BalanceMessages/BalanceMessages';

interface Balances {
  [address: string]: BN | null;
}

interface Subscriptions {
  [address: string]: () => void;
}

function subscribeToBalance(
  address: string,
  setBalances: (callback: (balances: Balances) => Balances) => void,
  subscriptions: Subscriptions,
) {
  async function balanceListener(data: BalanceChangeResponse) {
    if (data.address !== address) {
      return;
    }

    const balance = new BN(data.balance);
    setBalances((balances: Balances) => ({
      ...balances,
      ...(address in balances && { [address]: balance }),
    }));
  }

  const removeListener = onBalanceChangeResponse(balanceListener);
  sendBalanceChangeRequest(address);

  subscriptions[address] = () => {
    removeListener();
    delete subscriptions[address];
    setBalances((balances: Balances) => omit(balances, address));
  };
}

export function useStats(
  accounts: AccountsMap,
): { count: number; total: BN } | null {
  const accountsList = Object.values(accounts);

  const [balances, setBalances] = useState<Balances>(
    mapValues(accounts, () => null),
  );

  // A more straightforward way would be to use state, but that would cause unsubscribing everything
  // on every account list change.
  const subscriptions = useRef<Subscriptions>({}).current;
  useEffect(() => {
    return () => {
      Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
    };
  }, [subscriptions]);

  // On every account list change identify which addresses have been added or removed,
  // and subscribe or unsubscribe accordingly.
  useEffect(() => {
    accountsList.forEach(({ address }) => {
      const addressWasAdded = !(address in subscriptions);
      if (addressWasAdded) {
        subscribeToBalance(address, setBalances, subscriptions);
      }
    });

    Object.keys(subscriptions).forEach((address) => {
      const addressWasRemoved = !find(accountsList, { address });
      if (addressWasRemoved) {
        subscriptions[address]();
      }
    });
  }, [accountsList, subscriptions]);

  const balancesList = Object.values(balances);
  if (balancesList.includes(null)) {
    // do not show the total until all requests are fulfilled
    return null;
  }

  const count = accountsList.length;
  const total = new BN(0);
  balancesList.forEach((balance) => balance && total.iadd(balance));

  return { count, total };
}
