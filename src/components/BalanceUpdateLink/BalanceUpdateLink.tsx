import { useEffect, useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './BalanceUpdateLink.module.css';

import { paths } from '../../views/paths';
import { hasVestedFunds } from '../../utilities/vesting/vesting';

interface Props {
  address: string;
}

export function BalanceUpdateLink({ address }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    (async () => {
      const identityHasVestedFunds = await hasVestedFunds(address);
      if (identityHasVestedFunds) {
        setDisabled(false);
      }
    })();
  }, [address]);

  return (
    <Link
      onClick={(event) => disabled && event.preventDefault()}
      to={generatePath(paths.identity.vest, { address })}
      className={styles.update}
      aria-disabled={disabled}
      title={disabled ? t('component_BalanceUpdateLink_error') : undefined}
      aria-label={disabled ? t('component_BalanceUpdateLink_error') : undefined}
    >
      {t('component_BalanceUpdateLink_CTA')}
    </Link>
  );
}
