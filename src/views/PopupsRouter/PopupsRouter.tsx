import { Route, Switch } from 'react-router-dom';

import { useQuery } from '../../utilities/useQuery/useQuery';

import { paths } from '../paths';

function DemoComponent(): JSX.Element {
  // How to fetch passed parameters
  const values = useQuery();
  return <>{JSON.stringify(values)}</>;
}

export function PopupsRouter(): JSX.Element {
  return (
    <Switch>
      <Route path={paths.popup.claim}>
        <DemoComponent />
      </Route>
    </Switch>
  );
}
