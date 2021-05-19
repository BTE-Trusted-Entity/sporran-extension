import { useCallback, useEffect, useMemo, useState } from 'react';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';
import { useRouteMatch } from 'react-router-dom';
import { find } from 'lodash-es';
import { DataUtils } from '@kiltprotocol/utils';
import cx from 'classnames';

import { getFee } from '../../connection/FeeMessages/FeeMessages';
import { Account } from '../../utilities/accounts/types';
import { isNew } from '../../utilities/accounts/accounts';
import { AccountOverviewNew } from '../AccountOverview/AccountOverviewNew';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { Balance, useAddressBalance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';

import styles from './SendToken.module.css';

const nonNumberCharacters = /[^0-9,.]/g;
const KILT_POWER = 15;
const minimum = new BN(0.01e15);

function numberToBN(parsedValue: number): BN {
  const value = parsedValue.toString();

  // ludicrously rich man’s multiplication that supports values beyond 1e22
  const [whole, fraction = ''] = value.split('.');
  const paddedFraction = fraction
    .substring(0, KILT_POWER)
    .padEnd(KILT_POWER, '0');

  return new BN(whole + paddedFraction);
}

function getLocaleSeparators(locale: string = browser.i18n.getUILanguage()): {
  group?: string;
  decimal?: string;
} {
  const parts = new Intl.NumberFormat(locale).formatToParts(1234.5);
  const group = find(parts, { type: 'group' })?.value;
  const decimal = find(parts, { type: 'decimal' })?.value;
  return { group, decimal };
}

function parseWithSeparators(
  value: string,
  { group, decimal }: { group?: string; decimal?: string },
): number {
  const groupRE = new RegExp('\\' + group, 'g');
  const decimalOnly = value.replace(groupRE, '');

  const decimalRE = new RegExp('\\' + decimal, 'g');
  const decimalMatches = decimalOnly.match(decimalRE);
  if (!decimalMatches) {
    return parseInt(decimalOnly, 10);
  }

  const tooManyDecimalSeparators = decimalMatches.length > 1;
  if (tooManyDecimalSeparators) {
    return NaN;
  }

  const english = decimalOnly.replace(decimalRE, '.');
  return parseFloat(english);
}

function parseFloatLocale(value: string): number {
  if (nonNumberCharacters.test(value)) {
    return NaN;
  }

  const localeSpecific = parseWithSeparators(value, getLocaleSeparators());
  if (!Number.isNaN(localeSpecific)) {
    return localeSpecific;
  }

  return parseWithSeparators(value, getLocaleSeparators('en'));
}

function getIsAmountInvalidError(amount: string): string | null {
  const parsed = parseFloatLocale(amount);
  if (!Number.isNaN(parsed)) {
    return null;
  }

  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_invalid');
}

function getIsAmountTooSmallError(amount: number, minimum: BN): string | null {
  if (numberToBN(amount).gte(minimum)) {
    return null;
  }
  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_small', [asKiltCoins(minimum)]);
}

function getIsAmountTooLargeError(amount: number, maximum: BN): string | null {
  if (numberToBN(amount).lte(maximum)) {
    return null;
  }
  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_large');
}

function getAmountError(
  amount: string | null,
  maximum: BN | null,
): string | null {
  if (amount === null) {
    return null;
  }

  const amountValidError = getIsAmountInvalidError(amount);
  if (amountValidError) {
    return amountValidError;
  }

  const numericAmount = parseFloatLocale(amount);
  return [
    minimum && getIsAmountTooSmallError(numericAmount, minimum),
    maximum && getIsAmountTooLargeError(numericAmount, maximum),
  ].filter(Boolean)[0];
}

function getAddressError(address: string, account: Account): string | null {
  const t = browser.i18n.getMessage;
  try {
    if (address === account.address) {
      return t('view_SendToken_recipient_same');
    }
    DataUtils.validateAddress(address, 'recipient');
    return null;
  } catch (error) {
    return t('view_SendToken_recipient_invalid');
  }
}

function formatKiltInput(amount: BN): string {
  return asKiltCoins(amount).replace(/[,.]?0+$/, '');
}

interface Props {
  account: Account;
  onSuccess: (values: {
    recipient: string;
    amount: BN;
    fee: BN;
    tip: BN;
  }) => void;
}

export function SendToken({ account, onSuccess }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();

  const [fee, setFee] = useState<BN | null>(null);

  const balance = useAddressBalance(account.address);
  const maximum = balance && fee ? balance.free.sub(fee) : null;

  const [amount, setAmount] = useState<string | null>(null);
  const amountError = amount && getAmountError(amount, maximum);
  const numericAmount = amount && !amountError && parseFloatLocale(amount);
  const amountBN = useMemo(
    () =>
      typeof numericAmount === 'number' && !Number.isNaN(numericAmount)
        ? numberToBN(numericAmount)
        : new BN(0),
    [numericAmount],
  );

  const [tipPercents, setTipPercents] = useState(0);
  const tipBN = useMemo(
    () =>
      numericAmount
        ? numberToBN((tipPercents / 100) * numericAmount)
        : new BN(0),
    [numericAmount, tipPercents],
  );
  const totalFee = fee && tipBN ? fee.add(tipBN) : new BN(0);

  const totalError =
    maximum &&
    amountBN.add(totalFee).gt(maximum) &&
    t('view_SendToken_fee_large');

  const [recipient, setRecipient] = useState('');
  const recipientError = recipient && getAddressError(recipient, account);

  useEffect(() => {
    (async () => {
      const realFee = await getFee(amountBN, recipient);
      setFee(realFee);
    })();
  }, [amountBN, recipient]);

  const handleAmountInput = useCallback((event) => {
    const { value } = event.target;
    if (value.match(nonNumberCharacters)) {
      event.target.value = value.replace(nonNumberCharacters, '');
    }
    setAmount(value);
  }, []);

  const handleAmountBlur = useCallback((event) => {
    const { value } = event.target;
    if (value.length === 0) {
      setAmount(value);
      return;
    }
    const parsedValue = parseFloatLocale(value);
    if (Number.isNaN(parsedValue)) {
      return;
    }
    const femtoKilts = numberToBN(parsedValue);
    const formatted = formatKiltInput(femtoKilts);
    event.target.value = formatted;
    setAmount(formatted);
  }, []);

  const handleAllInClick = useCallback(
    (event) => {
      if (!maximum) {
        return;
      }
      const input = event.target.form.amount;
      input.value = formatKiltInput(maximum);
      setAmount(input.value);
    },
    [maximum],
  );

  const handleDecreaseTipClick = useCallback(() => {
    setTipPercents(tipPercents - 1);
  }, [tipPercents]);

  const handleIncreaseTipClick = useCallback(() => {
    setTipPercents(tipPercents + 1);
  }, [tipPercents]);

  const handleRecipientInput = useCallback((event) => {
    const { value } = event.target;
    setRecipient(value.trim());
  }, []);

  const showPasteButton =
    navigator.clipboard && 'readText' in navigator.clipboard;

  const handleRecipientPaste = useCallback(async (event) => {
    const input = event.target.form.recipient;
    if ('chrome' in window) {
      input.focus();
      document.execCommand('paste'); // Chrome doesn’t support the new API in extensions
    } else {
      const address = await navigator.clipboard.readText();
      input.value = address;
      setRecipient(address.trim());
    }
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!(recipient && fee && tipBN && numericAmount)) {
        return;
      }
      onSuccess({
        recipient,
        amount: numberToBN(numericAmount),
        fee,
        tip: tipBN,
      });
    },
    [onSuccess, recipient, numericAmount, fee, tipBN],
  );

  if (isNew(account)) {
    return <AccountOverviewNew />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_SendToken_heading')}</h1>
      <p className={styles.subline}>{t('view_SendToken_subline')}</p>

      <AccountsCarousel path={path} account={account} />
      <Balance address={account.address} />

      <small className={styles.maximum}>
        {t('view_SendToken_maximum')}
        {maximum && `${asKiltCoins(maximum)} K`}
      </small>

      <p className={styles.amountLine}>
        <input
          className={styles.amount}
          onInput={handleAmountInput}
          onBlur={handleAmountBlur}
          name="amount"
          inputMode="numeric"
          required
          autoFocus
          maxLength={15}
          aria-label={t('view_SendToken_amount')}
          placeholder={
            maximum
              ? `${asKiltCoins(minimum)} – ${asKiltCoins(maximum)}`
              : undefined
          }
        />

        <button type="button" className={styles.all} onClick={handleAllInClick}>
          {t('view_SendToken_all_in')}
        </button>

        <output
          htmlFor="amount"
          className={styles.amountError}
          hidden={!(amountError || totalError)}
        >
          {amountError || totalError}
        </output>
      </p>

      <p className={styles.totalLine}>
        <button
          className={styles.decrease}
          type="button"
          onClick={handleDecreaseTipClick}
          title={t('view_SendToken_tip_decrease')}
          aria-label={t('view_SendToken_tip_decrease')}
          disabled={tipPercents <= 0}
        />
        <small className={styles.total}>
          {t('view_SendToken_total_fee')}
          {asKiltCoins(totalFee)} K
        </small>
        <button
          className={styles.increase}
          type="button"
          onClick={handleIncreaseTipClick}
          title={t('view_SendToken_tip_increase')}
          aria-label={t('view_SendToken_tip_increase')}
          disabled={
            !!numericAmount &&
            !!maximum &&
            numberToBN(((100 + tipPercents + 1) / 100) * numericAmount).gt(
              maximum,
            )
          }
        />
      </p>

      <small className={styles.tip}>
        {t('view_SendToken_tip', [tipPercents])}
      </small>

      <p className={styles.recipientLine}>
        <input
          id="recipient"
          name="recipient"
          className={cx(
            styles.recipient,
            showPasteButton && styles.recipientWithButton,
          )}
          onInput={handleRecipientInput}
          required
          aria-label={t('view_SendToken_recipient')}
          placeholder={t('view_SendToken_recipient')}
        />
        {showPasteButton && (
          <button
            onClick={handleRecipientPaste}
            className={styles.paste}
            type="button"
            title={t('common_action_paste')}
            aria-label={t('common_action_paste')}
          />
        )}
        <output
          htmlFor="recipient"
          className={styles.recipientError}
          hidden={!recipientError}
        >
          {recipientError}
        </output>
      </p>

      <button
        type="submit"
        className={styles.submit}
        disabled={
          !amount ||
          Boolean(amountError) ||
          Boolean(totalError) ||
          !recipient ||
          Boolean(recipientError)
        }
      >
        {t('view_SendToken_CTA')}
      </button>

      <LinkBack />
      <Stats />
    </form>
  );
}
