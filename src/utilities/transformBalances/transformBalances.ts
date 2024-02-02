import BN from 'bn.js';

interface rawBalances {
  free: BN;
  miscFrozen: BN;
  feeFrozen: BN;
  reserved: BN;
}

interface rawBalancesV2 {
  free: BN;
  reserved: BN;
  frozen: BN;
  flag: BN;
}

interface TransformedBalances {
  transferable: BN;
  usableForFees: BN;
  locked: BN;
  bonded: BN;
  total: BN;
}

export function transformBalances(balances: rawBalances): TransformedBalances {
  const { free, reserved, miscFrozen, feeFrozen } = balances;
  const transferable = BN.max(free.sub(miscFrozen), new BN(0));
  const usableForFees = BN.max(free.sub(feeFrozen), new BN(0));
  const total = free.add(reserved);

  return {
    transferable,
    usableForFees,
    locked: miscFrozen,
    bonded: reserved,
    total,
  };
}

export function transformBalancesV2(balances: rawBalancesV2): TransformedBalances {
  const { free, reserved, frozen } = balances;
  const transferable = BN.max(free.sub(frozen), new BN(0));
  const usableForFees = BN.max(free.sub(frozen), new BN(0));
  const total = free.add(reserved);

  return {
    transferable,
    usableForFees,
    locked: frozen,
    bonded: reserved,
    total,
  };
}
