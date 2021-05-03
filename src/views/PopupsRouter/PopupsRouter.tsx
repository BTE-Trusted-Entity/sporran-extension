import { Route, Switch } from 'react-router-dom';

import { SignQuote } from '../SignQuote/SignQuote';
import { paths } from '../paths';

export function PopupsRouter(): JSX.Element {
  return (
    <Switch>
      <Route path={paths.popup.claim}>
        <SignQuote />
      </Route>
    </Switch>
  );
}
