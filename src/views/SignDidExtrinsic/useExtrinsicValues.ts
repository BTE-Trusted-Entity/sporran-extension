import { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import {
  getExtrinsicCallEntry,
  getExtrinsicDocsEntry,
  Value,
} from '../../utilities/extrinsicDetails/extrinsicDetails';

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
    })();
  }, [input]);

  return values;
}
