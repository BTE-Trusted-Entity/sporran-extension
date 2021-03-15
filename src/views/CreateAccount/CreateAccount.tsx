import { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Identity, init } from '@kiltprotocol/core';
import { ClipLoader } from 'react-spinners';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';

export function CreateAccount(): JSX.Element {
  const [mnemonic, setMnemonic] = useState('');

  useEffect(() => {
    (async () => {
      // TODO: move address to config file
      await init({ address: 'wss://full-nodes.kilt.io:9944' });
      setMnemonic(Identity.generateMnemonic());
    })();
  }, []);

  if (!mnemonic) {
    return <ClipLoader />;
  }

  return (
    <Switch>
      <Route path="/account/create" exact>
        <Warning />
      </Route>
      <Route path="/account/create/verify">
        <SaveBackupPhrase backupPhrase={mnemonic} />
      </Route>
    </Switch>
  );
}
