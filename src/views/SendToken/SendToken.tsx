import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';
import { find } from 'lodash-es';
import { BalanceUtils } from '@kiltprotocol/core';
import { DataUtils } from '@kiltprotocol/utils';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import * as styles from './SendToken.module.css';

import { getFee } from '../../utilities/getFee/getFee';
import { Identity } from '../../utilities/identities/types';
import { isNew, useIdentities } from '../../utilities/identities/identities';
import { IdentityOverviewNew } from '../IdentityOverview/IdentityOverviewNew';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Balance, useAddressBalance } from '../../components/Balance/Balance';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';
import { usePasteButton } from '../../components/usePasteButton/usePasteButton';
import { useOnline } from '../../utilities/useOnline/useOnline';
import { useConfiguration } from '../../configuration/useConfiguration';

const noError = null;
const nonNumberCharacters = /[^0-9,.\u066C\u2019\u202F]/g;
const KILT_POWER = 15;
const minimum = BalanceUtils.toFemtoKilt(0.01);
let existential: BN | undefined;

function numberToBN(parsedValue: number): BN {
  const value = parsedValue.toFixed(KILT_POWER);

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
  if (value.match(nonNumberCharacters)) {
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
    return noError;
  }

  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_invalid');
}

function getIsAmountTooSmallError(amount: number, minimum: BN): string | null {
  if (numberToBN(amount).gte(minimum)) {
    return noError;
  }
  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_small', [asKiltCoins(minimum, 'funds')]);
}

function getIsAmountTooLargeError(amount: number, maximum: BN): string | null {
  if (numberToBN(amount).lte(maximum)) {
    return noError;
  }
  const t = browser.i18n.getMessage;
  return t('view_SendToken_amount_large');
}

function getIsAmountSmallerThanRecipientExistential(
  amount: number,
  recipientBalanceZero: boolean | undefined,
): string | null {
  if (
    !recipientBalanceZero ||
    !existential ||
    numberToBN(amount).gte(existential)
  ) {
    return noError;
  }
  const t = browser.i18n.getMessage;
  return t('view_SendToken_error_existential_recepient');
}

function getAmountError(
  amount: string | null,
  maximum: BN | null,
  recipientBalanceZero: boolean | undefined,
): string | null {
  if (amount === null) {
    return noError;
  }

  const amountValidError = getIsAmountInvalidError(amount);
  if (amountValidError) {
    return amountValidError;
  }

  const numericAmount = parseFloatLocale(amount);
  return [
    minimum && getIsAmountTooSmallError(numericAmount, minimum),
    maximum && getIsAmountTooLargeError(numericAmount, maximum),
    getIsAmountSmallerThanRecipientExistential(
      numericAmount,
      recipientBalanceZero,
    ),
  ].filter(Boolean)[0];
}

function isValidAddress(address: string): boolean {
  try {
    DataUtils.validateAddress(address, 'recipient');
    return true;
  } catch (error) {
    return false;
  }
}

function getAddressError(address: string, identity: Identity): string | null {
  const t = browser.i18n.getMessage;

  if (address === identity.address) {
    return t('view_SendToken_recipient_same');
  }

  if (!isValidAddress(address)) {
    return t('view_SendToken_recipient_invalid');
  }

  return noError;
}

function formatKiltInput(amount: BN): string {
  return asKiltCoins(amount, 'funds').replace(/[,.]?0+$/, '');
}

interface Props {
  identity: Identity;
  onSuccess: (values: {
    recipient: string;
    amount: BN;
    fee: BN;
    tip: BN;
    existentialWarning: boolean;
  }) => void;
}

export function SendToken({ identity, onSuccess }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  useEffect(() => {
    (async () => {
      const { api } = await BlockchainApiConnection.getConnectionOrConnect();
      existential = api.consts.balances.existentialDeposit;
    })();
  }, []);

  const [fee, setFee] = useState<BN | null>(null);

  const balance = useAddressBalance(identity.address);
  const maximum =
    balance && fee ? BN.max(balance.transferable.sub(fee), new BN(0)) : null;

  const [recipient, setRecipient] = useState('');
  const recipientError = recipient && getAddressError(recipient, identity);

  const recipientBalance = useAddressBalance(
    isValidAddress(recipient) ? recipient : '',
  );
  const recipientBalanceZero = recipientBalance?.total?.isZero?.();

  const [amount, setAmount] = useState<string | null>(null);
  const amountError =
    amount && getAmountError(amount, maximum, recipientBalanceZero);

  const numericAmount =
    amount && !getIsAmountInvalidError(amount) && parseFloatLocale(amount);

  const amountBN = useMemo(
    () =>
      typeof numericAmount === 'number' && !Number.isNaN(numericAmount)
        ? numberToBN(numericAmount)
        : new BN(0),
    [numericAmount],
  );

  const [tipPercents, setTipPercents] = useState(0);
  const tipBN = useMemo(() => {
    if (!numericAmount) {
      return new BN(0);
    }
    const preciseTip = (tipPercents / 100) * numericAmount;
    const preciseTipBN = numberToBN(preciseTip);

    // Technically tip is costs, but if we round it up here the user might not be able to set tip below 0.0002,
    // while if we round it down the user will always able to increase it.
    const roundedTipString = asKiltCoins(preciseTipBN, 'funds');
    const roundedTip = parseFloatLocale(roundedTipString);

    return numberToBN(roundedTip);
  }, [numericAmount, tipPercents]);

  const { totalCosts, existentialWarning, finalTip } = useMemo(() => {
    const totalCosts = tipBN.add(fee || new BN(0));

    if (!balance || !maximum || !fee) {
      return { totalCosts };
    }

    const remainingTotal = balance.total.sub(amountBN).sub(totalCosts);
    const existentialWarning =
      existential && remainingTotal.lt(existential) && !remainingTotal.isZero();

    const remainingTransferable = maximum.sub(amountBN);
    // Including some tip slightly increases the transaction size and the fee, allow some room for it
    const remainingAdjustedForTip = remainingTransferable.sub(fee.muln(0.05));

    const finalTip = existentialWarning
      ? BN.max(remainingAdjustedForTip, tipBN)
      : tipBN;

    return {
      totalCosts,
      existentialWarning,
      finalTip,
    };
  }, [amountBN, balance, maximum, fee, tipBN]);

  const totalError =
    maximum && amountBN.add(tipBN).gt(maximum) && t('view_SendToken_fee_large');

  useEffect(() => {
    (async () => {
      if (isNew(identity)) {
        return;
      }
      if (recipient && !isValidAddress(recipient)) {
        return;
      }
      const realFee = await getFee({
        amount: amountBN,
        tip: tipBN,
        recipient,
      });
      setFee(realFee);
    })();
  }, [amountBN, identity, recipient, tipBN]);

  const handleAmountInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (value.match(nonNumberCharacters)) {
        (event.target as HTMLInputElement).value = value.replace(
          nonNumberCharacters,
          '',
        );
      }
      setAmount(value);
    },
    [],
  );

  const handleAmountBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
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
    },
    [],
  );

  const handleAllInClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!maximum) {
        return;
      }

      const target = event.target as unknown as {
        form: HTMLFormElement;
      };

      const input = target.form.amount;
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

  const handleRecipientInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setRecipient(value.trim());
    },
    [],
  );

  const identities = useIdentities();
  const { features } = useConfiguration();

  const recipientRef = useRef(null);
  const paste = usePasteButton(recipientRef, setRecipient);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (!(recipient && fee && finalTip && numericAmount)) {
        return;
      }

      onSuccess({
        recipient,
        amount: numberToBN(numericAmount),
        fee,
        tip: finalTip,
        existentialWarning: Boolean(existentialWarning),
      });
    },
    [onSuccess, recipient, numericAmount, fee, existentialWarning, finalTip],
  );

  const online = useOnline();

  if (isNew(identity)) {
    return <IdentityOverviewNew />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_SendToken_heading')}</h1>
      <p className={styles.subline}>{t('view_SendToken_subline')}</p>

      <IdentitiesCarousel identity={identity} options={false} />
      <Balance address={identity.address} smallDecimals />

      <small className={styles.maximum}>
        {t('view_SendToken_maximum')}
        {maximum && `${asKiltCoins(maximum, 'funds')} K`}
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
              ? `${asKiltCoins(minimum, 'funds')} – ${asKiltCoins(
                  maximum,
                  'funds',
                )}`
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
          {asKiltCoins(totalCosts, 'costs')} K
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
        <datalist id="identities">
          {features.recipientsList &&
            identities.data &&
            Object.values(identities.data).map(
              ({ address, name }) =>
                address !== identity.address && (
                  <option value={address} key={address}>
                    {name}
                  </option>
                ),
            )}
        </datalist>

        <input
          id="recipient"
          name="recipient"
          list="identities"
          className={
            paste.supported ? styles.recipientWithButton : styles.recipient
          }
          onInput={handleRecipientInput}
          ref={recipientRef}
          required
          aria-label={t('view_SendToken_recipient')}
          placeholder={t('view_SendToken_recipient')}
        />
        {paste.supported && (
          <button
            onClick={paste.handlePasteClick}
            className={paste.className}
            type="button"
            title={paste.title}
            aria-label={paste.title}
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

      <p className={styles.submitLine}>
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
        <output className={styles.offlineError} hidden={online}>
          {!online && t('view_SendToken_offline')}
        </output>
      </p>

      <LinkBack />
      <Stats />
    </form>
  );
}
