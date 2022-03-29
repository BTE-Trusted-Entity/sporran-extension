import { ReactNode, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { map } from 'lodash-es';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { GenericCall } from '@polkadot/types';

import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';

interface Value {
  value: ReactNode;
  label: string;
}

export function useExtrinsicValues(
  input: SignDidExtrinsicOriginInput,
): Value[] {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    (async () => {
      const t = browser.i18n.getMessage;

      const { origin } = input;
      const { api } = await BlockchainApiConnection.getConnectionOrConnect();

      const extrinsic = api.createType('Extrinsic', input.extrinsic);

      const { meta } = extrinsic;
      const { section } = extrinsic.method;

      const forbidden = section === 'did';
      const errorLine = {
        label: 'FORBIDDEN',
        value: 'All did.* calls are forbidden',
      };
      const error = !forbidden ? [] : [errorLine];

      const argumentValues = (extrinsic.method as GenericCall).toHuman()
        .args as Record<string, unknown>;
      const argumentNames = meta && map(meta.args, 'name');
      const nameValuePairs = argumentNames.map(
        (name) =>
          `${name} = ${JSON.stringify(argumentValues[name.toString()])}`,
      );
      const methodSignature = meta ? `(${nameValuePairs.join(', ')})` : '';

      const method = `${section}.${extrinsic.method.method}${methodSignature}`;

      setValues([
        ...error,
        { value: origin, label: t('view_SignDidExtrinsic_from') },
        { value: method, label: t('view_SignDidExtrinsic_method') },
      ]);
    })();
  }, [input]);

  return values;
}
