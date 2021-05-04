import { Route, Switch } from 'react-router-dom';

import { SignQuote } from '../SignQuote/SignQuote';
import { SaveCredential } from '../SaveCredential/SaveCredential';
import { paths } from '../paths';

export function PopupsRouter(): JSX.Element {
  return (
    <Switch>
      <Route path={paths.popup.claim}>
        <SignQuote />
      </Route>
      <Route path={paths.popup.save}>
        <SaveCredential />
      </Route>
    </Switch>
  );
}
