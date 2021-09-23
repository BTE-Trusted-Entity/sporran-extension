import { useEffect, useRef, useState } from 'react';
import BN from 'bn.js';
import { find, mapValues, omit } from 'lodash-es';

import { IdentitiesMap } from '../../utilities/identities/identities';
import {
  BalanceChange,
  onAddressBalanceChange,
} from '../../utilities/balanceChanges/balanceChanges';

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
  async function handleBalance(error: Error | null, balance?: BalanceChange) {
    if (error || !balance) {
      console.error(error);
      return;
    }
    if (balance.address !== address) {
      return;
    }
    setBalances((balances: Balances) => ({
      ...balances,
      ...(address in balances && { [address]: balance.balances.total }),
    }));
  }

  const unsubscribe = onAddressBalanceChange(address, handleBalance);

  subscriptions[address] = () => {
    unsubscribe();
    delete subscriptions[address];
    setBalances((balances: Balances) => omit(balances, address));
  };
}

export function useStats(
  identities: IdentitiesMap,
): { count: number; total: BN } | null {
  const identitiesList = Object.values(identities);

  const [balances, setBalances] = useState<Balances>(
    mapValues(identities, () => null),
  );

  // A more straightforward way would be to use state, but that would cause unsubscribing everything
  // on every identity list change.
  const subscriptions = useRef<Subscriptions>({}).current;
  useEffect(() => {
    return () => {
      Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
    };
  }, [subscriptions]);

  // On every identity list change identify which addresses have been added or removed,
  // and subscribe or unsubscribe accordingly.
  useEffect(() => {
    identitiesList.forEach(({ address }) => {
      const addressWasAdded = !(address in subscriptions);
      if (addressWasAdded) {
        subscribeToBalance(address, setBalances, subscriptions);
      }
    });

    Object.keys(subscriptions).forEach((address) => {
      const addressWasRemoved = !find(identitiesList, { address });
      if (addressWasRemoved) {
        subscriptions[address]();
      }
    });
  }, [identitiesList, subscriptions]);

  const balancesList = Object.values(balances);
  if (balancesList.includes(null)) {
    return null; // do not show the total until all requests are fulfilled
  }

  const count = identitiesList.length;
  const total = new BN(0);
  balancesList.forEach((balance) => balance && total.iadd(balance));

  return { count, total };
}
