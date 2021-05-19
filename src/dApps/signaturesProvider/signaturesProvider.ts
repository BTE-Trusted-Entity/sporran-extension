import { getSignPopupResult } from '../SignPopupMessages/SignPopupMessages';
import { produceSignPopupWindowResult } from '../SignPopupWindowMessages/SignPopupWindowMessages';
import { checkAccess } from '../checkAccess/checkAccess';

export function handleAllSignRequests(origin: string): () => void {
  return produceSignPopupWindowResult(async ({ dAppName, payload }) => {
    await checkAccess(dAppName, origin);
    return getSignPopupResult(payload);
  });
}
