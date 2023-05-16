import { Route, Switch, useHistory } from 'react-router-dom';

import { useCallback, useState } from 'react';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';
import { SignDid } from '../SignDid/SignDid';
import { SignDidCredentialsSelect } from '../SignDidCredentialsSelect/SignDidCredentialsSelect';
import { SignDidStart } from '../SignDidStart/SignDidStart';
import { backgroundSignDidChannel } from '../../channels/SignDidChannels/backgroundSignDidChannel';
import { SharedCredential } from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';

interface Props {
  identity: Identity;
}

export function SignDidFlow({ identity }: Props) {
  const onCancel = useCallback(async () => {
    await backgroundSignDidChannel.throw('Rejected');
    window.close();
  }, []);

  const popupData = usePopupData<SignDidOriginInput>();

  const [credentials, setCredentials] = useState<SharedCredential[]>();

  const resetCredentials = useCallback(() => {
    setCredentials(undefined);
  }, []);

  const history = useHistory();

  const onSubmit = useCallback(
    (selected: SharedCredential[]) => {
      setCredentials(selected);
      history.push(
        generatePath(paths.popup.signDid.sign, {
          address: identity.address,
        }),
      );
    },
    [history, identity],
  );

  return (
    <Switch>
      <Route path={paths.popup.signDid.sign}>
        <SignDid
          identity={identity}
          credentials={credentials}
          popupData={popupData}
          onCancel={onCancel}
        />
      </Route>

      <Route path={paths.popup.signDid.credentials}>
        <SignDidCredentialsSelect
          identity={identity}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </Route>

      <Route path={paths.popup.signDid.start}>
        <SignDidStart
          popupData={popupData}
          identity={identity}
          resetCredentials={resetCredentials}
        />
      </Route>
    </Switch>
  );
}
