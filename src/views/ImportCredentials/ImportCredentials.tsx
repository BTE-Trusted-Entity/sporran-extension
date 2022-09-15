import { useCallback, useMemo, useState } from 'react';
import { filter, reject, sortBy } from 'lodash-es';
import { Credential as KiltCredential } from '@kiltprotocol/core';

import {
  Credential,
  saveCredential,
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
            const credential = JSON.parse(text) as Credential;

            const {
              request,
              name = fileName,
              status = 'pending',
              cTypeTitle,
              attester,
            } = credential;

            if (!cTypeTitle || !attester) {
              throw new Error('invalid');
            }

            // @ts-expect-error We removed the claimerSignature property from the interface. If an imported credential still has it, we drop it.
            delete request.claimerSignature;

            await KiltCredential.verifyCredential(request);

            const knownIdentity = identitiesList.find(
              ({ did }) => did === request.claim.owner,
            );
            if (!knownIdentity) {
              throw new Error('orphaned');
            }

            await saveCredential({
              request,
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

  const handleMoreClick = useCallback(() => {
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
