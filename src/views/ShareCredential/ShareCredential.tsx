import { JSX, useCallback, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Identity } from '../../utilities/identities/types';
import { SporranCredential } from '../../utilities/credentials/credentials';

import { shareChannel } from '../../channels/shareChannel/shareChannel';
import { paths } from '../paths';

import { ShareCredentialSign } from '../ShareCredentialSign/ShareCredentialSign';
import { ShareCredentialSelect } from '../ShareCredentialSelect/ShareCredentialSelect';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { ShareInput } from '../../channels/shareChannel/types';

export interface Selected {
  sporranCredential: SporranCredential;
  identity: Identity;
  sharedContents: string[];
}

export function ShareCredential(): JSX.Element | null {
  const handleCancel = useCallback(async () => {
    await shareChannel.throw('Rejected');
    window.close();
  }, []);

  const popupData = usePopupData<ShareInput>();

  const [selected, setSelected] = useState<Selected>();

  const handleSelect = useCallback((value: Selected) => setSelected(value), []);

  return (
    <Switch>
      <Route path={paths.popup.share.sign}>
        {selected && (
          <ShareCredentialSign
            selected={selected}
            onCancel={handleCancel}
            popupData={popupData}
          />
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
