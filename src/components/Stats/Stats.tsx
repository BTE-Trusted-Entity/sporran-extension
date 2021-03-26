import { browser } from 'webextension-polyfill-ts';

import { plural } from '../../utilities/plural/plural';
import { KiltAmount } from '../KiltAmount/KiltAmount';
import { AccountsMap } from '../../utilities/accounts/accounts';
import { useStats } from './useStats';

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
    <p>
      {plural(stats.count, {
        one: 'component_Stats_account_one',
        other: 'component_Stats_account_other',
      })}

      {t('component_Stats_balance')}
      <KiltAmount amount={stats.total} />
    </p>
  );
}

export function Stats({ accounts }: Props): JSX.Element | null {
  if (Object.values(accounts).length < 2) {
    return null;
  }

  return <UnconditionalStats accounts={accounts} />;
}
