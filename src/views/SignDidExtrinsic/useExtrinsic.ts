import { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { GenericExtrinsic } from '@polkadot/types';

import { DidChain } from '@kiltprotocol/did';
import { IDidDetails } from '@kiltprotocol/types';

import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import {
  getExtrinsicCallEntry,
  getExtrinsicDocsEntry,
  Value,
} from '../../utilities/extrinsicDetails/extrinsicDetails';
import { parseDidUri, isFullDid } from '../../utilities/did/did';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

export function useExtrinsic(
  input: SignDidExtrinsicOriginInput,
): GenericExtrinsic | undefined {
  const [extrinsic, setExtrinsic] = useState<GenericExtrinsic>();
  useEffect(() => {
    (async () => {
      const { api } = await BlockchainApiConnection.getConnectionOrConnect();
      setExtrinsic(api.createType('Extrinsic', input.extrinsic));
    })();
  }, [input]);

  return extrinsic;
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

export function getAddServiceEndpointValues(extrinsic: GenericExtrinsic): {
  id: string;
  serviceTypes: string[];
  urls: string[];
} {
  const human = extrinsic.toHuman() as {
    method: Parameters<typeof getExtrinsicCallEntry>[0];
  };

  return human.method.args['service_endpoint'] as {
    id: string;
    serviceTypes: string[];
    urls: string[];
  };
}

export function useRemoveServiceEndpointValues(
  extrinsic: GenericExtrinsic,
  did: IDidDetails['did'],
  error: ReturnType<typeof useBooleanState>,
): {
  id: string;
  serviceTypes?: string[];
  urls?: string[];
} {
  const t = browser.i18n.getMessage;

  const [id, setId] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    setId('');
    setServiceTypes([]);
    setUrls([]);
    error.off();

    (async () => {
      const human = extrinsic.toHuman() as {
        method: Parameters<typeof getExtrinsicCallEntry>[0];
      };

      const id = human.method.args['service_id'] as string;
      setId(id);

      if (!isFullDid(did)) {
        return;
      }

      const { identifier } = parseDidUri(did);

      const result = await DidChain.queryServiceEndpoint(identifier, id);

      if (!result) {
        error.on();
      } else {
        const { types, urls } = result;
        setServiceTypes(types);
        setUrls(urls);
      }
    })();
  }, [extrinsic, did, t, error]);

  return { id, serviceTypes, urls };
}
