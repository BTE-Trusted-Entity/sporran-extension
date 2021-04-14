import { useCallback, useState } from 'react';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';
import { useRouteMatch } from 'react-router-dom';
import { find } from 'lodash-es';
import { DataUtils } from '@kiltprotocol/utils';
import cx from 'classnames';

import { Account } from '../../utilities/accounts/types';
import { AccountsCarousel } from '../../components/AccountsCarousel/AccountsCarousel';
import { Balance, useAddressBalance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { useErrorTooltip } from '../../components/useErrorMessage/useErrorTooltip';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';

import styles from './SendToken.module.css';

const nonNumberCharacters = /[^0-9,.]/g;
const FEMTO_FACTOR = 1e15;
const minimum = new BN(0.01e15);

function numberToCoins(parsedValue: number): BN {
  return new BN((parsedValue * FEMTO_FACTOR).toString());
}

function getLocaleSeparators(
  locale: string = browser.i18n.getUILanguage(),
): { group?: string; decimal?: string } {
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
  if (numberToCoins(amount).gte(minimum)) {
    return null;
  }
  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_small', [asKiltCoins(minimum)]);
}

function getIsAmountTooLargeError(amount: number, maximum: BN): string | null {
  if (numberToCoins(amount).lte(maximum)) {
    return null;
  }
  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_large');
}

function getAmountError(amount: string | null, maximum: BN): string | null {
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

function getAddressError(address: string): string | null {
  try {
    DataUtils.validateAddress(address, 'recipient');
    return null;
  } catch (error) {
    const t = browser.i18n.getMessage;
    return t('view_SendToken_recipient_invalid');
  }
}

function formatKiltInput(amount: BN): string {
  return asKiltCoins(amount).replace(/[,.]?0+$/, '');
}

interface Props {
  account: Account;
}

export function SendToken({ account }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { path } = useRouteMatch();

  const [fee] = useState<BN | null>(new BN(0.0001e15)); // TODO: fetch real value

  const balance = useAddressBalance(account.address);
  const maximum = balance && fee ? balance.sub(fee) : null;

  const [amount, setAmount] = useState<string | null>(null);
  const amountError = amount && maximum && getAmountError(amount, maximum);
  const numericAmount = amount && !amountError && parseFloatLocale(amount);

  const [tipPercents] = useState(0);
  const tipBN = numericAmount && new BN((tipPercents / 100) * numericAmount);
  const totalFee = fee && tipBN ? fee.add(tipBN) : new BN(0);

  const [recipient, setRecipient] = useState('');
  const recipientError = recipient && getAddressError(recipient);
  const recipientTooltip = useErrorTooltip(Boolean(recipientError));

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
    const femtoKilts = numberToCoins(parsedValue);
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

  const handleRecipientInput = useCallback((event) => {
    const { value } = event.target;
    setRecipient(value.trim());
  }, []);

  const showPasteButton =
    navigator.clipboard && 'readText' in navigator.clipboard;

  const handleRecipientPaste = useCallback(async (event) => {
    const address = await navigator.clipboard.readText();
    event.target.form.recipient.value = address;
    setRecipient(address.trim());
  }, []);

  return (
    <form className={styles.container}>
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
          aria-label={t('view_SendToken_amount')}
          placeholder={
            maximum
              ? `${asKiltCoins(maximum)} - ${asKiltCoins(minimum)}`
              : undefined
          }
        />

        <button type="button" className={styles.all} onClick={handleAllInClick}>
          {t('view_SendToken_all_in')}
        </button>

        {amountError && (
          <output htmlFor="amount" className={styles.amountError}>
            {amountError}
            <span className={styles.amountPointer} />
          </output>
        )}
      </p>

      <p className={styles.totalLine}>
        <button
          className={styles.decrease}
          type="button"
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
          title={t('view_SendToken_tip_increase')}
          aria-label={t('view_SendToken_tip_increase')}
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
          {...recipientTooltip.anchor}
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
        <output htmlFor="recipient" {...recipientTooltip.tooltip}>
          {recipientError}
          <span {...recipientTooltip.pointer} />
        </output>
      </p>

      <button
        type="submit"
        className={styles.submit}
        disabled={
          !amount ||
          Boolean(amountError) ||
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
