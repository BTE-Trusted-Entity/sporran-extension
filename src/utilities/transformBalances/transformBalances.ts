import BN from 'bn.js';

interface TransformedBalances {
  transferable: BN;
  usableForFees: BN;
  frozen: BN;
  bonded: BN;
  total: BN;
}

export interface BalancesV1 {
  free: BN;
  miscFrozen: BN;
  feeFrozen: BN;
  reserved: BN;
}

export interface BalancesV2 {
  free: BN;
  reserved: BN;
  frozen: BN;
  flag: BN;
}

function isBalancesV2(obj: unknown): obj is BalancesV2 {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'free' in obj &&
    obj.free instanceof BN &&
    'reserved' in obj &&
    obj.reserved instanceof BN &&
    'frozen' in obj &&
    obj.frozen instanceof BN &&
    'flags' in obj &&
    obj.flags instanceof BN
  );
}

function transformBalancesV1(balances: BalancesV1): TransformedBalances {
  const { free, reserved, miscFrozen, feeFrozen } = balances;
  const transferable = BN.max(free.sub(miscFrozen), new BN(0));
  const usableForFees = BN.max(free.sub(feeFrozen), new BN(0));
  const total = free.add(reserved);

  return {
    transferable,
    usableForFees,
    frozen: miscFrozen,
    bonded: reserved,
    total,
  };
}
function transformBalancesV2(balances: BalancesV2): TransformedBalances {
  const { free, reserved, frozen } = balances;
  const transferable = BN.max(free.sub(frozen), new BN(0));
  const usableForFees = BN.max(free.sub(frozen), new BN(0));
  const total = free.add(reserved);

  return {
    transferable,
    usableForFees,
    frozen,
    total,
    bonded: reserved,
  };
}

export function transformBalances(
  balances: BalancesV1 | BalancesV2,
): TransformedBalances {
  if (isBalancesV2(balances)) {
    return transformBalancesV2(balances);
  }
  return transformBalancesV1(balances);
}
