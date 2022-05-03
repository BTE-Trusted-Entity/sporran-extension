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
import { parseDidUri } from '../../utilities/did/did';

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
    value: 'All did.* calls are forbidden',
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
): {
  values: {
    id: string;
    serviceTypes?: string[];
    urls?: string[];
  };
  error?: string;
} {
  const t = browser.i18n.getMessage;

  const [id, setId] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const human = extrinsic.toHuman() as {
        method: Parameters<typeof getExtrinsicCallEntry>[0];
      };

      const id = human.method.args['service_id'] as string;
      setId(id);

      const { identifier } = parseDidUri(did);

      const result = await DidChain.queryServiceEndpoint(identifier, id);

      if (!result) {
        setError(t('view_SignDidExtrinsic_endpoint_remove_error'));
      } else {
        const { types, urls } = result;
        setServiceTypes(types);
        setUrls(urls);
      }
    })();
  }, [extrinsic, did, t]);

  return { values: { id, serviceTypes, urls }, error };
}
