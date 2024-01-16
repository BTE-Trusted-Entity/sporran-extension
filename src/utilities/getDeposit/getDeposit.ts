import type { Did, KiltAddress } from '@kiltprotocol/types';

import { ConfigService } from '@kiltprotocol/sdk-js';
import {
  depositFromChain,
  linkedInfoFromChain,
  parse,
  toChain,
} from '@kiltprotocol/did';

import BN from 'bn.js';

import { isFullDid } from '../did/did';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { ActionType } from '../../views/DidEndpointsSign/DidEndpointsSign';

interface DepositData {
  amount: BN;
  owner?: KiltAddress;
}

async function getDefaultDeposit() {
  const api = ConfigService.get('api');
  return { amount: api.consts.web3Names.deposit };
}

async function getDepositWeb3Name(
  did: Did | undefined,
): Promise<DepositData | undefined> {
  if (!did || !isFullDid(did)) {
    return getDefaultDeposit();
  }

  const api = ConfigService.get('api');

  const {
    document: { alsoKnownAs },
  } = linkedInfoFromChain(await api.call.did.query(toChain(did)));

  if (!alsoKnownAs) {
    return getDefaultDeposit();
  }

  const data = await api.query.web3Names.owner(alsoKnownAs[0]);

  if (data.isNone) {
    return;
  }
  return depositFromChain(data.unwrap().deposit);
}

export function useDepositWeb3Name(
  did: Did | undefined,
): DepositData | undefined {
  return useAsyncValue(getDepositWeb3Name, [did]);
}

export async function getDepositDid(
  did: Did | undefined,
): Promise<DepositData | undefined> {
  const api = ConfigService.get('api');

  if (!did || parse(did).type === 'light') {
    if ('deposit' in api.consts.did) {
      // TODO: remove this `if` once the Spiritnet is updated
      return { amount: api.consts.did.deposit as unknown as BN };
    }

    const baseDeposit = api.consts.did.baseDeposit as unknown as BN;
    const keyDeposit = api.consts.did.keyDeposit as unknown as BN;
    const amount = baseDeposit.add(keyDeposit).add(keyDeposit);
    return { amount };
  }

  return depositFromChain(
    (await api.query.did.did(toChain(did))).unwrap().deposit,
  );
}

export function useDepositDid(did: Did | undefined): DepositData | undefined {
  return useAsyncValue(getDepositDid, [did]);
}

export function getDepositServiceEndpoint(type: ActionType): DepositData {
  const api = ConfigService.get('api');
  if (type !== 'add' || !('serviceEndpointDeposit' in api.consts.did)) {
    return { amount: new BN(0) };
  }

  return { amount: api.consts.did.serviceEndpointDeposit as unknown as BN };
}
