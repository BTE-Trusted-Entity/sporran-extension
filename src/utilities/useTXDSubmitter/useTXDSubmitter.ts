import ky from 'ky';

import { getExternalURLs } from '../getExternalURLs/getExternalURLs';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

async function getSubmitter() {
  const { txd } = await getExternalURLs();

  const { paymentAddress } = await ky
    .get(`${txd}/meta`)
    .json<{ paymentAddress: string }>();

  return paymentAddress;
}

export function useTXDSubmitter() {
  return useAsyncValue(getSubmitter, []);
}
