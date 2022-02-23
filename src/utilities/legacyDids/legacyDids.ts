import { useState, useEffect } from 'react';

import { needLegacyDidCrypto } from '../did/did';
import { IdentitiesMap } from '../identities/types';
import { useIdentities } from '../identities/identities';

export async function getLegacyDidIdentities(
  identities: IdentitiesMap,
): Promise<IdentitiesMap> {
  const legacyDidIdentities: IdentitiesMap = {};

  for (const identity of Object.values(identities)) {
    if (await needLegacyDidCrypto(identity.did)) {
      legacyDidIdentities[identity.address] = identity;
    }
  }
  return legacyDidIdentities;
}

export function useLegacyDidIdentities(): IdentitiesMap {
  const identities = useIdentities().data;

  const [legacyDidIdentities, setLegacyDidIdentities] = useState<IdentitiesMap>(
    {},
  );

  useEffect(() => {
    if (!identities) {
      return;
    }
    (async () => {
      setLegacyDidIdentities(await getLegacyDidIdentities(identities));
    })();
  }, [identities]);

  return legacyDidIdentities;
}
