import BN from 'bn.js';

interface rawBalances {
  free: BN;
  miscFrozen: BN;
  feeFrozen: BN;
  reserved: BN;
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
  const transferable = free.sub(miscFrozen);
  const usableForFees = free.sub(feeFrozen);
  const total = free.add(reserved);

  return {
    transferable,
    usableForFees,
    locked: miscFrozen,
    bonded: reserved,
    total,
  };
}
