import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { useCallback, useState } from 'react';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';
import { SignDid } from '../SignDid/SignDid';
import { SignDidCredentialsSelect } from '../SignDidCredentialsSelect/SignDidCredentialsSelect';
import { SignDidStart } from '../SignDidStart/SignDidStart';
import { backgroundSignDidChannel } from '../../channels/SignDidChannels/backgroundSignDidChannel';
import { SharedCredential } from '../../utilities/credentials/credentials';

interface Props {
  identity: Identity;
}

export function SignDidFlow({ identity }: Props) {
  const history = useHistory();

  const [popupQuery, setPopupQuery] = useState<string>();

  const onCancel = useCallback(async () => {
    await backgroundSignDidChannel.throw('Rejected');
    window.close();
  }, []);

  const [credentials, setCredentials] = useState<SharedCredential[]>();

  // reset state when navigating back to start after submitting credential selection
  if (
    useRouteMatch({ path: paths.popup.signDid.start, exact: true }) &&
    credentials
  ) {
    setCredentials(undefined);
  }

  const onSubmit = useCallback(
    (selected: SharedCredential[]) => {
      setCredentials(selected);
      history.push(
        generatePath(paths.popup.signDid.sign + popupQuery, {
          address: identity.address,
        }),
      );
    },
    [history, identity, popupQuery],
  );

  return (
    <Switch>
      <Route path={paths.popup.signDid.sign}>
        <SignDid identity={identity} credentials={credentials} />
      </Route>

      <Route path={paths.popup.signDid.credentials}>
        <SignDidCredentialsSelect
          identity={identity}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Route>

      <Route path={paths.popup.signDid.start}>
        <SignDidStart identity={identity} setPopupQuery={setPopupQuery} />
      </Route>
    </Switch>
  );
}
