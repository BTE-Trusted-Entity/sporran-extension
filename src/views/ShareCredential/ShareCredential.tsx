import { useCallback, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { Credential } from '../../utilities/credentials/credentials';

import { shareChannel } from '../../channels/shareChannel/shareChannel';
import { paths } from '../paths';

import { ShareCredentialSign } from '../ShareCredentialSign/ShareCredentialSign';
import { ShareCredentialSelect } from '../ShareCredentialSelect/ShareCredentialSelect';

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

  const handleSelect = useCallback((value: Selected) => setSelected(value), []);

  return (
    <Switch>
      <Route path={paths.popup.share.sign}>
        {selected && (
          <ShareCredentialSign selected={selected} onCancel={handleCancel} />
        )}
      </Route>
      <Route path={paths.popup.share.start}>
        <ShareCredentialSelect
          onCancel={handleCancel}
          onSelect={handleSelect}
          selected={selected}
        />
      </Route>
    </Switch>
  );
}
