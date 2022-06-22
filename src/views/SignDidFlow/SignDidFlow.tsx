import { Route, Switch } from 'react-router-dom';

import { useState, useCallback } from 'react';

import { omit } from 'lodash-es';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';
import { SignDid } from '../SignDid/SignDid';
import { SignDidCredentialsSelect } from '../SignDidCredentialsSelect/SignDidCredentialsSelect';
import { SignDidStart } from '../SignDidStart/SignDidStart';
import { Credential } from '../../utilities/credentials/credentials';
import { backgroundSignDidChannel } from '../../channels/SignDidChannels/backgroundSignDidChannel';

export interface Presentation {
  credential: Credential;
  sharedContents: string[];
}

interface Props {
  identity: Identity;
}

export function SignDidFlow({ identity }: Props) {
  const handleCancel = useCallback(async () => {
    await backgroundSignDidChannel.throw('Rejected');
    window.close();
  }, []);

  const [presentations, setPresentations] =
    useState<Record<string, Presentation>>();

  const handleSelect = useCallback(
    (presentation: Presentation) => {
      const key = presentation.credential.request.rootHash;
      setPresentations({ ...presentations, [key]: presentation });
    },
    [presentations],
  );

  const handleUnSelect = useCallback(
    (key: string) => {
      setPresentations(omit(presentations, key));
    },
    [presentations],
  );

  return (
    <Switch>
      <Route path={paths.popup.signDid.sign}>
        <SignDid
          identity={identity}
          credentials={presentations ? Object.values(presentations) : undefined}
        />
      </Route>

      <Route path={paths.popup.signDid.credentials.select}>
        <SignDidCredentialsSelect
          identity={identity}
          onSelect={handleSelect}
          onUnSelect={handleUnSelect}
          onCancel={handleCancel}
          selected={presentations}
        />
      </Route>

      <Route path={paths.popup.signDid.start}>
        <SignDidStart identity={identity} />
      </Route>
    </Switch>
  );
}
