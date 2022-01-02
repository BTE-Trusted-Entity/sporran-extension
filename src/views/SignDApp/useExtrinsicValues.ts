import { browser } from 'webextension-polyfill-ts';
import { ReactNode, useEffect, useState } from 'react';
import BN from 'bn.js';
import { map } from 'lodash-es';
import { ExtrinsicPayload } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { SignOriginInput } from '../../dApps/SignChannels/types';

export async function getExtrinsic(
  input: SignerPayloadJSON,
): Promise<ExtrinsicPayload> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  api.registry.setSignedExtensions(input.signedExtensions);

  const params = { version: input.version };
  return api.registry.createType('ExtrinsicPayload', input, params);
}

async function getMethodText(methodSource: string) {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const call = api.registry.createType('Call', methodSource);

  const { section, method, meta } = call;

  const argumentValues = call.toHuman().args as Record<string, unknown>;
  const argumentNames = meta && map(meta.args, 'name');
  const nameValuePairs = argumentNames.map(
    (name) => `${name} = ${JSON.stringify(argumentValues[name.toString()])}`,
  );
  const methodSignature = meta ? `(${nameValuePairs.join(', ')})` : '';

  return `${section}.${method}${methodSignature}`;
}

function formatBlock(block: number) {
  const locale = browser.i18n.getUILanguage();
  const formatter = new Intl.NumberFormat(locale, { useGrouping: true });
  return formatter.format(block);
}

interface Value {
  value: ReactNode;
  label: string;
}

export function useExtrinsicValues(input: SignOriginInput): Value[] {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    (async () => {
      const t = browser.i18n.getMessage;

      const { genesisHash, origin } = input;
      const { api } = await BlockchainApiConnection.getConnectionOrConnect();
      const sameBlockchain = genesisHash === api.genesisHash.toString();
      const errorLine = { value: 'WRONG genesisHash', label: genesisHash };
      const error = sameBlockchain ? [] : [errorLine];

      const extrinsic = await getExtrinsic(input);
      const { era } = extrinsic;

      const specVersion = extrinsic.specVersion.toNumber();
      const nonce = extrinsic.nonce.toNumber();
      const method = await getMethodText(input.method);
      const blockNumber = new BN(input.blockNumber.substring(2), 16);
      const lifetime = !era.isImmortalEra
        ? t('view_SignDApp_mortal', [
            formatBlock(era.asMortalEra.birth(blockNumber)),
            formatBlock(era.asMortalEra.death(blockNumber)),
          ])
        : t('view_SignDApp_immortal');

      setValues([
        ...error,
        { value: origin, label: t('view_SignDApp_from') },
        { value: specVersion, label: t('view_SignDApp_version') },
        { value: nonce, label: t('view_SignDApp_nonce') },
        { value: method, label: t('view_SignDApp_method') },
        { value: lifetime, label: t('view_SignDApp_lifetime') },
      ]);
    })();
  }, [input]);

  return values;
}
