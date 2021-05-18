import { getPopupResult } from '../../connection/PopupMessages/PopupMessages';
import { produceSignPopupResult } from '../SignPopupMessages/SignPopupMessages';
import { checkAccess } from '../checkAccess/checkAccess';

export function handleAllSignRequests(origin: string): () => void {
  return produceSignPopupResult(async ({ dAppName, payload }) => {
    await checkAccess(dAppName, origin);

    const result = await getPopupResult('sign', {
      ...payload,
      version: String(payload.version),
      signedExtensions: JSON.stringify(payload.signedExtensions),
    });

    const id = parseInt(result.id);
    const { signature } = result;

    return { id, signature };
  });
}
