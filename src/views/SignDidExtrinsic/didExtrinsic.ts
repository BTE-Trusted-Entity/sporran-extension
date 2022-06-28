import { browser } from 'webextension-polyfill-ts';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { GenericExtrinsic } from '@polkadot/types';

import { Chain } from '@kiltprotocol/did';
import { DidUri, DidServiceEndpoint } from '@kiltprotocol/types';

import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import {
  getExtrinsicCallEntry,
  getExtrinsicDocsEntry,
  Value,
} from '../../utilities/extrinsicDetails/extrinsicDetails';
import { parseDidUri, isFullDid } from '../../utilities/did/did';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

export async function getExtrinsic(
  input: SignDidExtrinsicOriginInput,
): Promise<GenericExtrinsic> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  return api.createType('Extrinsic', input.extrinsic);
}

export function getExtrinsicValues(
  extrinsic: GenericExtrinsic,
  origin: string,
): Value[] {
  const t = browser.i18n.getMessage;

  const human = extrinsic.toHuman() as {
    method: Parameters<typeof getExtrinsicCallEntry>[0];
  };

  const forbidden = human.method.section === 'did';
  const errorLine = {
    label: 'FORBIDDEN',
    value: 'This DID call is forbidden',
  };
  const error = !forbidden ? [] : [errorLine];

  return [
    ...error,
    { value: origin, label: t('view_SignDidExtrinsic_from') },
    getExtrinsicCallEntry(human.method),
    ...getExtrinsicDocsEntry(extrinsic.meta),
  ];
}

export function getAddServiceEndpoint(
  extrinsic: GenericExtrinsic,
): DidServiceEndpoint {
  const human = extrinsic.toHuman() as {
    method: Parameters<typeof getExtrinsicCallEntry>[0];
  };

  const {
    id,
    serviceTypes: types,
    urls,
  } = human.method.args['service_endpoint'] as {
    id: string;
    serviceTypes: string[];
    urls: string[];
  };

  return { id, types, urls };
}

export async function getRemoveServiceEndpoint(
  extrinsic: GenericExtrinsic,
  did: DidUri,
  error: ReturnType<typeof useBooleanState>,
): Promise<DidServiceEndpoint> {
  error.off();

  const human = extrinsic.toHuman() as {
    method: Parameters<typeof getExtrinsicCallEntry>[0];
  };

  const id = human.method.args['service_id'] as string;

  if (!isFullDid(did)) {
    return { id, types: [], urls: [] };
  }

  const { identifier } = parseDidUri(did);

  const result = await Chain.queryServiceEndpoint(identifier, id);

  if (!result) {
    error.on();
    return { id, types: [], urls: [] };
  } else {
    const { types, urls } = result;
    return { id, types, urls };
  }
}
