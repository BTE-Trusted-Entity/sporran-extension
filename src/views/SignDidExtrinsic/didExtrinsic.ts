import browser from 'webextension-polyfill';
import {
  ConfigService,
  Did,
  DidServiceEndpoint,
  DidUri,
  UriFragment,
} from '@kiltprotocol/sdk-js';

import { GenericExtrinsic } from '@polkadot/types';

import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import {
  getExtrinsicCallEntry,
  getExtrinsicDocsEntry,
  Value,
} from '../../utilities/extrinsicDetails/extrinsicDetails';
import { isFullDid } from '../../utilities/did/did';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

export async function getExtrinsic(
  input: SignDidExtrinsicOriginInput,
): Promise<GenericExtrinsic> {
  const api = ConfigService.get('api');
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
    serviceTypes: type,
    urls: serviceEndpoint,
  } = human.method.args['service_endpoint'] as {
    id: string;
    serviceTypes: string[];
    urls: string[];
  };

  return { id: `#${id}`, type, serviceEndpoint };
}

export async function getRemoveServiceEndpoint(
  extrinsic: GenericExtrinsic,
  did: DidUri | undefined,
  error: ReturnType<typeof useBooleanState>,
): Promise<DidServiceEndpoint> {
  error.off();
  const human = extrinsic.toHuman() as {
    method: Parameters<typeof getExtrinsicCallEntry>[0];
  };

  const id = `#${human.method.args['service_id']}` as UriFragment;
  const fallback = { id, type: [], serviceEndpoint: [] };

  if (!did || !isFullDid(did)) {
    return fallback;
  }

  try {
    const api = ConfigService.get('api');
    const { document } = await Did.linkedInfoFromChain(
      await api.call.did.query(Did.toChain(did)),
    );
    const service = Did.getService(document, id);
    if (!service) {
      throw new Error('DID service not found');
    }
    return service;
  } catch {
    error.on();
    return fallback;
  }
}
