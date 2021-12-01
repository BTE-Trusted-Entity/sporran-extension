import { useCallback, useState } from 'react';
import {
  generatePath,
  Route,
  Routes,
  Switch,
  useNavigate,
} from 'react-router-dom';

import { importIdentity } from '../../utilities/identities/identities';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { paths } from '../paths';

export function ImportIdentity(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const navigate = useNavigate();

  const onImport = useCallback(
    (phrase) => {
      setBackupPhrase(phrase);
      navigate(paths.identity.import.password);
    },
    [navigate],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      const { address } = await importIdentity(backupPhrase, password);
      navigate(
        generatePath(paths.identity.overview, { address, type: 'imported' }),
      );
    },
    [backupPhrase, navigate],
  );

  return (
    <Routes>
      <Route
        path={paths.identity.import.start}
        element={<ImportBackupPhrase onImport={onImport} />}
      />
      <Route
        path={paths.identity.import.password}
        element={<CreatePassword onSuccess={onSuccess} />}
      />
    </Routes>
  );
}
