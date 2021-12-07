import { useCallback, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Credential } from '../../utilities/credentials/credentials';

import { shareChannel } from '../../channels/shareChannel/shareChannel';
import { paths } from '../paths';

import { ShareCredentialSign } from '../ShareCredentialSign/ShareCredentialSign';
import { ShareCredentialSelect } from '../ShareCredentialSelect/ShareCredentialSelect';
import { Identity } from '../../utilities/identities/types';

export interface Selected {
  credential: Credential;
  identity: Identity;
  sharedProps: string[];
}

export function ShareCredential(): JSX.Element | null {
  const handleCancel = useCallback(async () => {
    await shareChannel.throw('Rejected');
    window.close();
  }, []);

  const [selected, setSelected] = useState<Selected>();

  const handleSelect = useCallback((value) => setSelected(value), []);

  return (
    <Switch>
      {/* <Route path={paths.popup.shareSign}>
          <ShareCredentialSign selected={Selected} />
        </Route> */}
      <Route path={paths.popup.share}>
        <ShareCredentialSelect
          onCancel={handleCancel}
          onSelect={handleSelect}
          selected={selected}
        />
      </Route>
    </Switch>
  );
}
