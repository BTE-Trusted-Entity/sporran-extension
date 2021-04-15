import { browser } from 'webextension-polyfill-ts';

import { plural } from '../../utilities/plural/plural';
import { KiltAmount } from '../KiltAmount/KiltAmount';
import { AccountsMap, useAccounts } from '../../utilities/accounts/accounts';
import { useStats } from './useStats';

import styles from './Stats.module.css';

interface Props {
  accounts: AccountsMap;
}

function UnconditionalStats({ accounts }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const stats = useStats(accounts);
  if (!stats) {
    return null;
  }

  return (
    <p className={styles.stats}>
      {plural(stats.count, {
        one: 'component_Stats_account_one',
        other: 'component_Stats_account_other',
      })}
      <span className={styles.balance}>
        {t('component_Stats_balance')}
        <KiltAmount amount={stats.total} />
      </span>
    </p>
  );
}

export function Stats(): JSX.Element | null {
  const accounts = useAccounts().data;
  if (!accounts || Object.values(accounts).length < 2) {
    return null;
  }

  return <UnconditionalStats accounts={accounts} />;
}
