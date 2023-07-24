import browser from 'webextension-polyfill';
import { useEffect, useState } from 'react';
import BN from 'bn.js';
import { ExtrinsicPayload } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { ConfigService } from '@kiltprotocol/sdk-js';

import { SignOriginInput } from '../../dApps/SignChannels/types';
import {
  getExtrinsicCallEntry,
  getExtrinsicDocsEntry,
  Value,
} from '../../utilities/extrinsicDetails/extrinsicDetails';

export async function getExtrinsic(
  input: SignerPayloadJSON,
): Promise<ExtrinsicPayload> {
  const api = ConfigService.get('api');
  api.registry.setSignedExtensions(input.signedExtensions);

  const params = { version: input.version };
  return api.registry.createType('ExtrinsicPayload', input, params);
}

function formatBlock(block: number) {
  const locale = browser.i18n.getUILanguage();
  const formatter = new Intl.NumberFormat(locale, { useGrouping: true });
  return formatter.format(block);
}

export function useExtrinsicValues(input: SignOriginInput): Value[] {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    (async () => {
      const t = browser.i18n.getMessage;

      const { genesisHash, origin } = input;
      const api = ConfigService.get('api');
      const sameBlockchain = genesisHash === api.genesisHash.toString();
      const errorLine = { label: 'WRONG genesisHash', value: genesisHash };
      const error = sameBlockchain ? [] : [errorLine];

      const extrinsic = await getExtrinsic(input);
      const { era } = extrinsic;

      const call = api.registry.createType('Call', input.method);
      const { section, method, meta } = call;
      const args = call.toHuman().args as Record<string, unknown>;

      const specVersion = extrinsic.specVersion.toNumber();
      const nonce = extrinsic.nonce.toNumber();
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
        getExtrinsicCallEntry({ section, method, args }),
        ...getExtrinsicDocsEntry(meta),
        { value: lifetime, label: t('view_SignDApp_lifetime') },
      ]);
    })();
  }, [input]);

  return values;
}
