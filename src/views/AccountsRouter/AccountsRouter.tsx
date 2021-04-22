import { useEffect } from 'react';
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
import { SendToken } from '../SendToken/SendToken';
import { paths } from '../paths';

interface Props {
  accounts: AccountsMap;
}

export function SpecificAccountRouter({ accounts }: Props): JSX.Element {
  const { address } = useParams() as { address: string };

  useEffect(() => {
    setCurrentAccount(address);
  }, [address]);

  const isNew = address === NEW.address;
  const account = isNew ? NEW : accounts[address];
  if (!account) {
    return <Redirect to={paths.home} />;
  }

  return (
    <>
      <Switch>
        <Route path={paths.account.receive}>
          <ReceiveToken account={account} />
        </Route>

        <Route path={paths.account.send}>
          <SendToken account={account} />
        </Route>

        <Route path={paths.account.remove}>
          <RemoveAccount account={account} />
        </Route>

        <Route path={paths.account.reset.start}>
          <ResetAccount account={account} />
        </Route>

        <Route path={paths.account.created}>
          <AccountOverview account={account} successType="created" />
        </Route>

        <Route path={paths.account.imported}>
          <AccountOverview account={account} successType="imported" />
        </Route>

        <Route path={paths.account.reseted}>
          <AccountOverview account={account} successType="reset" />
        </Route>

        <Route path={paths.account.overview}>
          <AccountOverview account={account} />
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
