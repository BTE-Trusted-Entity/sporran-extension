import { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { GenericExtrinsic } from '@polkadot/types';

import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import {
  getExtrinsicCallEntry,
  getExtrinsicDocsEntry,
  Value,
} from '../../utilities/extrinsicDetails/extrinsicDetails';

interface ServiceEndpointValues {
  id: string;
  serviceTypes: string[];
  urls: string[];
}

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

export function useExtrinsicValues(
  extrinsic: GenericExtrinsic,
  origin: string,
): Value[] {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
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

    setValues([
      ...error,
      { value: origin, label: t('view_SignDidExtrinsic_from') },
      getExtrinsicCallEntry(human.method),
      ...getExtrinsicDocsEntry(extrinsic.meta),
    ]);
  }, [extrinsic, origin]);

  return values;
}

export function getServiceEndpointValues(
  extrinsic: GenericExtrinsic,
): ServiceEndpointValues {
  const human = extrinsic.toHuman() as {
    method: Parameters<typeof getExtrinsicCallEntry>[0];
  };

  return human.method.args['service_endpoint'] as ServiceEndpointValues;
}
