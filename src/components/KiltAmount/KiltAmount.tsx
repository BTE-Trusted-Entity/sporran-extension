import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';

import { KiltCurrency } from '../KiltCurrency/KiltCurrency';

import styles from './KiltAmount.module.css';

const KILT_POWER = 15;

const PRECISION = 4;
const FORMAT = {
  minimumFractionDigits: PRECISION,
  maximumFractionDigits: PRECISION,
};

const CONVERSION_FACTOR = new BN(10 ** (KILT_POWER - PRECISION));
const DIVIDER = 10 ** PRECISION;

function asKiltCoins(balance: BN): string {
  const numberWithFractions =
    balance.div(CONVERSION_FACTOR).toNumber() / DIVIDER;

  return numberWithFractions.toLocaleString(
    browser.i18n.getUILanguage(),
    FORMAT,
  );
}

interface Props {
  amount: BN;
}

export function KiltAmount({ amount }: Props): JSX.Element {
  return (
    <span className={styles.balance}>
      {asKiltCoins(amount)} <KiltCurrency />
    </span>
  );
}
