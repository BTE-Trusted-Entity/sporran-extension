import { useEffect, useState, useMemo } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';

import { paths } from '../../views/paths';

import { useAddressBalance } from '../Balance/Balance';

import { vestingFeeChannel } from '../../channels/VestingChannels/VestingChannels';
import { existentialDepositChannel } from '../../channels/existentialDepositChannel/existentialDepositChannel';

import styles from './BalanceUpdateLink.module.css';

interface Props {
  address: string;
  disabled: boolean;
}

export function BalanceUpdateLink({ address, disabled }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const balance = useAddressBalance(address);

  const [existentialDeposit, setExistentialDeposit] = useState<BN>();
  const [vestingFee, setVestingFee] = useState<BN>();

  useEffect(() => {
    (async () => {
      const fee = await vestingFeeChannel.get();
      const existential = await existentialDepositChannel.get();
      setVestingFee(fee);
      setExistentialDeposit(existential);
    })();
  }, []);

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
    <Link
      onClick={(event) => disabled && event.preventDefault()}
      to={generatePath(vestingPath, { address })}
      className={styles.update}
      aria-disabled={disabled}
      title={disabled ? t('component_Balance_update_error') : undefined}
      aria-label={disabled ? t('component_Balance_update_error') : undefined}
    >
      {t('component_Balance_update')}
    </Link>
  );
}
