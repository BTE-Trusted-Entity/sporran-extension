import { Route, Switch } from 'react-router-dom';

import { AuthorizeDApp } from '../AuthorizeDApp/AuthorizeDApp';
import { SaveCredential } from '../SaveCredential/SaveCredential';
import { ShareCredential } from '../ShareCredential/ShareCredential';
import { SignDApp } from '../SignDApp/SignDApp';
import { SignRawDApp } from '../SignRawDApp/SignRawDApp';
import { ImportCredentials } from '../ImportCredentials/ImportCredentials';
import { AttestationRejected } from '../AttestationRejected/AttestationRejected';
import { paths } from '../paths';

export function PopupsRouter(): JSX.Element {
  return (
    <Switch>
      <Route path={paths.popup.access}>
        <AuthorizeDApp />
      </Route>
      <Route path={paths.popup.save}>
        <SaveCredential />
      </Route>
      <Route path={paths.popup.reject}>
        <AttestationRejected />
      </Route>
      <Route path={paths.popup.share.start}>
        <ShareCredential />
      </Route>
      <Route path={paths.popup.sign}>
        <SignDApp />
      </Route>
      <Route path={paths.popup.signRaw}>
        <SignRawDApp />
      </Route>
      <Route path={paths.popup.import}>
        <ImportCredentials />
      </Route>
    </Switch>
  );
}
