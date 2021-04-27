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

export function asKiltCoins(balance: BN): string {
  const balanceString = balance.toString().padStart(16, '0');
  const whole = balanceString.slice(0, -KILT_POWER);
  const fraction = balanceString.slice(-KILT_POWER);
  const numberWithFractions = parseFloat(`${whole}.${fraction}`);

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
    <span className={styles.amount}>
      {asKiltCoins(amount)} <KiltCurrency />
    </span>
  );
}
