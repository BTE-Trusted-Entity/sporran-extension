import { Route, Switch } from 'react-router-dom';

import { AuthorizeDApp } from '../AuthorizeDApp/AuthorizeDApp';
import { SaveCredential } from '../SaveCredential/SaveCredential';
import { ShareCredential } from '../ShareCredential/ShareCredential';
import { SignDApp } from '../SignDApp/SignDApp';
import { paths } from '../paths';

export function PopupsRouter(): JSX.Element {
  return (
    <Switch>
      <Route path={paths.popup.authorize}>
        <AuthorizeDApp />
      </Route>
      <Route path={paths.popup.save}>
        <SaveCredential />
      </Route>
      <Route path={paths.popup.share}>
        <ShareCredential />
      </Route>
      <Route path={paths.popup.sign}>
        <SignDApp />
      </Route>
    </Switch>
  );
}
