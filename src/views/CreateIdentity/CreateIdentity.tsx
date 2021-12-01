import { useCallback, useMemo } from 'react';
import {
  generatePath,
  Route,
  Routes,

  useNavigate,
} from 'react-router-dom';

import { mnemonicGenerate } from '@polkadot/util-crypto';

import { SaveBackupPhrase } from '../SaveBackupPhrase/SaveBackupPhrase';
import { Warning } from '../Warning/Warning';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { createIdentity } from '../../utilities/identities/identities';
import { VerifyBackupPhrase } from '../VerifyBackupPhrase/VerifyBackupPhrase';
import { paths } from '../paths';

export function CreateIdentity(): JSX.Element {
  const backupPhrase = useMemo(() => mnemonicGenerate(), []);
  const navigate = useNavigate();

  const onSuccess = useCallback(
    async (password: string) => {
      const { address } = await createIdentity(backupPhrase, password);

      navigate(
        generatePath(paths.identity.overview, { address, type: 'created' }),
      );
    },
    [backupPhrase, navigate],
  );

  return (
    <Routes>
      <Route path={paths.identity.create.start} element={<Warning />} />
      <Route
        path={paths.identity.create.backup}
        element={<SaveBackupPhrase backupPhrase={backupPhrase} />}
      />
      <Route
        path={paths.identity.create.verify}
        element={<VerifyBackupPhrase backupPhrase={backupPhrase} />}
      />
      <Route
        path={paths.identity.create.password}
        element={<CreatePassword onSuccess={onSuccess} />}
      />
    </Routes>
  );
}
