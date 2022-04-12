import { generatePath, Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './BalanceUpdateLink.module.css';

import { paths } from '../../views/paths';
import { hasVestedFunds } from '../../utilities/vesting/vesting';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

interface Props {
  address: string;
}

export function BalanceUpdateLink({ address }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const enabled = useAsyncValue(hasVestedFunds, [address]);

  return (
    <Link
      onClick={(event) => !enabled && event.preventDefault()}
      to={generatePath(paths.identity.vest, { address })}
      className={styles.update}
      aria-disabled={!enabled}
      title={enabled ? undefined : t('component_BalanceUpdateLink_error')}
      aria-label={enabled ? undefined : t('component_BalanceUpdateLink_error')}
    >
      {t('component_BalanceUpdateLink_CTA')}
    </Link>
  );
}
