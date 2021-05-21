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

type Type = 'funds' | 'costs';

export function asKiltCoins(amount: BN, type: Type): string {
  const amountString = amount.toString().padStart(16, '0');
  const whole = amountString.slice(0, -KILT_POWER);
  const fraction = amountString.slice(-KILT_POWER);

  const visible = fraction.slice(0, PRECISION);
  const discarded = fraction.slice(PRECISION);
  const noRoundingNeeded = discarded.match(/^0*$/);
  const roundDown = noRoundingNeeded || type === 'funds';
  const replacement = roundDown ? '0' : '9';

  const numberWithFractions = parseFloat(`${whole}.${visible}${replacement}`);

  return numberWithFractions.toLocaleString(
    browser.i18n.getUILanguage(),
    FORMAT,
  );
}

interface Props {
  amount: BN;
  type: Type;
}

export function KiltAmount({ amount, type }: Props): JSX.Element {
  return (
    <span className={styles.amount}>
      {asKiltCoins(amount, type)} <KiltCurrency />
    </span>
  );
}
