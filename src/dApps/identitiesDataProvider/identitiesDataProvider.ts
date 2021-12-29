import { InjectedAccount } from '@polkadot/extension-inject/types';
import { browser, Storage } from 'webextension-polyfill-ts';

import { injectedIdentitiesChannel } from '../injectedIdentitiesChannel/injectedIdentitiesChannel';
import { genesisHashChannel } from '../genesisHashChannel/genesisHashChannel';
import { storageAreaName } from '../../utilities/storage/storage';
import {
  IDENTITIES_KEY,
  getIdentities,
} from '../../utilities/identities/getIdentities';
import { contentAccessChannel } from '../AccessChannels/contentAccessChannel';

async function getIdentitiesForInjectedAPI(): Promise<InjectedAccount[]> {
  const identities = await getIdentities();
  const genesisHash = await genesisHashChannel.get();

  return Object.values(identities).map(({ name, address }) => ({
    name,
    address,
    type: 'sr25519',
    genesisHash,
  }));
}

interface Changes {
  [key: string]: Storage.StorageChange;
}

function subscribe(
  handleIdentities: (identities: InjectedAccount[]) => void,
): () => void {
  async function handleChanges(changes: Changes, areaName: string) {
    if (areaName !== storageAreaName) {
      return;
    }

    const needToNotify = IDENTITIES_KEY in changes;
    if (needToNotify) {
      handleIdentities(await getIdentitiesForInjectedAPI());
    }
  }

  browser.storage.onChanged.addListener(handleChanges);
  return () => browser.storage.onChanged.removeListener(handleChanges);
}

export function initContentIdentitiesChannel(origin: string): () => void {
  return injectedIdentitiesChannel.publish(async (dAppName, publisher) => {
    await contentAccessChannel.get({ dAppName, origin });
    publisher(null, await getIdentitiesForInjectedAPI());
    return subscribe((identities) => publisher(null, identities));
  });
}
