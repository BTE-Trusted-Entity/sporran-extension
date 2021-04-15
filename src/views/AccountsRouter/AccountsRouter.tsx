import { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';

import {
  AccountsMap,
  NEW,
  setCurrentAccount,
  useAccounts,
} from '../../utilities/accounts/accounts';
import { ReceiveToken } from '../ReceiveToken/ReceiveToken';
import { CreateAccount } from '../CreateAccount/CreateAccount';
import { ImportAccount } from '../ImportAccount/ImportAccount';
import { AccountOverview } from '../AccountOverview/AccountOverview';
import { ResetAccount } from '../ResetAccount/ResetAccount';
import { RemoveAccount } from '../RemoveAccount/RemoveAccount';
import { paths } from '../paths';
import { getNextTartan } from '../../utilities/accounts/tartans';

interface Props {
  accounts: AccountsMap;
}

export function SpecificAccountRouter({ accounts }: Props): JSX.Element {
  const { address } = useParams() as { address: string };

  useEffect(() => {
    setCurrentAccount(address);
  }, [address]);

  const [nextTartan, setNextTartan] = useState('');

  useEffect(() => {
    (async () => setNextTartan(await getNextTartan()))();
  }, []);

  const isNew = address === NEW.address;
  const account = isNew ? NEW : accounts[address];
  if (!account) {
    return <Redirect to={paths.home} />;
  }

  return (
    <>
      <Switch>
        <Route path={paths.account.receive}>
          <ReceiveToken account={account} nextTartan={nextTartan} />
        </Route>

        <Route path={paths.account.remove}>
          <RemoveAccount account={account} />
        </Route>

        <Route path={paths.account.reset.start}>
          <ResetAccount account={account} />
        </Route>

        <Route path={paths.account.overview}>
          <AccountOverview account={account} nextTartan={nextTartan} />
        </Route>
      </Switch>
    </>
  );
}

export function AccountsRouter(): JSX.Element {
  const accounts = useAccounts();

  return (
    <Switch>
      <Route path={paths.account.create.start}>
        <CreateAccount />
      </Route>

      <Route path={paths.account.import.start}>
        <ImportAccount />
      </Route>

      <Route path={paths.account.overview}>
        {accounts.data && <SpecificAccountRouter accounts={accounts.data} />}
      </Route>
    </Switch>
  );
}
