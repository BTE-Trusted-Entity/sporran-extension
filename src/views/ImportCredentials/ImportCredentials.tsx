import { JSX, MouseEvent, useCallback, useMemo, useState } from 'react';
import { filter, reject, sortBy } from 'lodash-es';
import { Credential, Did } from '@kiltprotocol/sdk-js';

import {
  SporranCredential,
  saveCredential,
  updateLegacyCredential,
} from '../../utilities/credentials/credentials';
import { exceptionToError } from '../../utilities/exceptionToError/exceptionToError';
import { useIdentities } from '../../utilities/identities/identities';

import { ImportCredentialsForm } from './ImportCredentialsForm';
import { ImportCredentialsResults } from './ImportCredentialsResults';
import { FailedImport, Import, SuccessfulImport } from './types';

export function ImportCredentials(): JSX.Element | null {
  const [processing, setProcessing] = useState(false);
  const [pending, setPending] = useState<Import[]>([]);
  const [failedImports, setFailedImports] = useState<FailedImport[]>([]);
  const [successfulImports, setSuccessfulImports] = useState<
    SuccessfulImport[]
  >([]);

  const identities = useIdentities().data;
  const identitiesList =
    identities && sortBy(Object.values(identities), 'index');

  const grouped = useMemo(() => {
    if (!identitiesList) {
      return null;
    }
    return identitiesList
      .map((identity) => ({
        identity,
        imports: filter(successfulImports, {
          identityAddress: identity.address,
        }),
      }))
      .filter(({ imports }) => imports.length > 0);
  }, [identitiesList, successfulImports]);

  const handleFiles = useCallback(
    (files: FileList) => {
      const filesList = [...files];

      if (!identitiesList) {
        return;
      }

      const pending = filesList.map((file) => ({ fileName: file.name }));
      setPending(pending);
      setProcessing(true);

      (async () => {
        for (const file of filesList) {
          const fileName = file.name;
          try {
            const text = await file.text();
            const sporranCredential = JSON.parse(text) as SporranCredential;

            const {
              credential,
              name = fileName,
              status = 'pending',
              cTypeTitle,
              attester,
            } = updateLegacyCredential(sporranCredential);

            if (!cTypeTitle || !attester) {
              throw new Error('invalid');
            }
            try {
              await Credential.verifyWellFormed(credential);
            } catch {
              throw new Error('invalid');
            }

            const knownIdentity = identitiesList.find(
              ({ did }) =>
                did && Did.isSameSubject(did, credential.claim.owner),
            );
            if (!knownIdentity) {
              throw new Error('orphaned');
            }

            await saveCredential({
              credential,
              name,
              status,
              cTypeTitle,
              attester,
              isDownloaded: true,
            });

            setSuccessfulImports((successfulImports) => [
              ...successfulImports,
              { fileName, identityAddress: knownIdentity.address },
            ]);
          } catch (exception) {
            const error = exceptionToError(exception);
            setFailedImports((failedImports) => [
              ...failedImports,
              { fileName, error: error.message },
            ]);
          } finally {
            setPending((pending) => reject(pending, { fileName }));
          }
        }
      })();
    },
    [identitiesList],
  );

  const handleMoreClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    setProcessing(false);
    setPending([]);
    setSuccessfulImports([]);
    setFailedImports([]);
  }, []);

  if (!grouped) {
    return null; // storage data pending
  }

  if (!processing) {
    return <ImportCredentialsForm handleFiles={handleFiles} />;
  }

  return (
    <ImportCredentialsResults
      pending={pending}
      grouped={grouped}
      failedImports={failedImports}
      setFailedImports={setFailedImports}
      handleMoreClick={handleMoreClick}
    />
  );
}
