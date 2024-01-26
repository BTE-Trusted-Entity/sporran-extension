import type { Did, Service, UriFragment } from '@kiltprotocol/types';

import browser from 'webextension-polyfill';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { linkedInfoFromChain, toChain } from '@kiltprotocol/did';

import { GenericExtrinsic } from '@polkadot/types';

import { find } from 'lodash-es';

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

export function getAddServiceEndpoint(extrinsic: GenericExtrinsic): Service {
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
  did: Did | undefined,
  error: ReturnType<typeof useBooleanState>,
): Promise<Service> {
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
    const {
      document: { service },
    } = linkedInfoFromChain(await api.call.did.query(toChain(did)));

    const foundService = find(service, { id });
    if (!foundService) {
      throw new Error('DID service not found');
    }
    return foundService;
  } catch {
    error.on();
    return fallback;
  }
}
