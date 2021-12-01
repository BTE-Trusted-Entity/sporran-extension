import { useCallback, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import {
  Identity,
  encryptIdentity,
} from '../../utilities/identities/identities';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { paths, generatePath } from '../paths';

export function ResetIdentity({
  identity,
}: {
  identity: Identity;
}): JSX.Element {
  const { address } = identity;
  const [backupPhrase, setBackupPhrase] = useState('');
  const navigate = useNavigate();

  const onImport = useCallback(
    (phrase) => {
      setBackupPhrase(phrase);
      navigate(generatePath(paths.identity.reset.password, { address }));
    },
    [navigate, address],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      await encryptIdentity(backupPhrase, password);
      navigate(
        generatePath(paths.identity.overview, { address, type: 'pwreset' }),
      );
    },
    [backupPhrase, navigate, address],
  );

  return (
    <Routes>
      <Route
        path={generatePath(paths.identity.reset.start, { address })}
        element={
          <ImportBackupPhrase
            type="reset"
            address={address}
            onImport={onImport}
          />
        }
      />
      <Route
        path={generatePath(paths.identity.reset.password, { address })}
        element={<CreatePassword onSuccess={onSuccess} />}
      />
    </Routes>
  );
}
