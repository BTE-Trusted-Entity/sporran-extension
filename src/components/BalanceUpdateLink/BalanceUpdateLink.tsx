import { useEffect, useState, useMemo } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';

import { paths } from '../../views/paths';

import { useAddressBalance } from '../Balance/Balance';

import {
  vestingFeeChannel,
  hasVestedFundsChannel,
} from '../../channels/VestingChannels/VestingChannels';
import { existentialDepositChannel } from '../../channels/existentialDepositChannel/existentialDepositChannel';

import styles from './BalanceUpdateLink.module.css';

interface TemplateProps {
  address: string;
  disabled: boolean;
  path: string;
}

export function BalanceUpdateLinkTemplate({
  address,
  disabled,
  path,
}: TemplateProps): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <Link
      onClick={(event) => disabled && event.preventDefault()}
      to={generatePath(path, { address })}
      className={styles.update}
      aria-disabled={disabled}
      title={disabled ? t('component_BalanceUpdateLink_error') : undefined}
      aria-label={disabled ? t('component_BalanceUpdateLink_error') : undefined}
    >
      {t('component_BalanceUpdateLink_CTA')}
    </Link>
  );
}

interface Props {
  address: string;
}

export function BalanceUpdateLink({ address }: Props): JSX.Element {
  const balance = useAddressBalance(address);

  const [disabled, setDisabled] = useState(true);

  const [existentialDeposit, setExistentialDeposit] = useState<BN>();
  const [vestingFee, setVestingFee] = useState<BN>();

  useEffect(() => {
    (async () => {
      const accountHasVestedFunds = await hasVestedFundsChannel.get(address);
      if (accountHasVestedFunds) {
        setDisabled(false);
      }

      const fee = await vestingFeeChannel.get();
      const existential = await existentialDepositChannel.get();
      setVestingFee(fee);
      setExistentialDeposit(existential);
    })();
  }, [address]);

  const existentialWarning = useMemo(() => {
    if (!(balance && vestingFee && existentialDeposit)) {
      return false;
    }

    const remainingBalance = balance.total.sub(vestingFee);

    return (
      remainingBalance.lt(existentialDeposit) && !remainingBalance.isZero()
    );
  }, [balance, existentialDeposit, vestingFee]);

  const vestingPath = existentialWarning
    ? paths.account.vest.warning
    : paths.account.vest.sign;

  return (
    <BalanceUpdateLinkTemplate
      address={address}
      disabled={disabled}
      path={vestingPath}
    />
  );
}
