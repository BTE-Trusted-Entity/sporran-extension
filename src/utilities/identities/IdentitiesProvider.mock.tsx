import { IdentitiesMap, Identity } from './types';
import { IdentitiesContext } from './IdentitiesContext';

export const identitiesMock: IdentitiesMap = {
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
    name: 'KILT Identity 1',
    address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
    did: 'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
    index: 1,
  },
  '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
    name: 'KILT Identity 2',
    address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
    did: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
    index: 2,
  },
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
    name: 'KILT Identity 3 which has a very long name and might not even fit on the screen',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
    did: 'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
    index: 3,
  },
};

export const moreIdentitiesMock: IdentitiesMap = {
  ...identitiesMock,
  '4oESHtb7Hu6grwwQVpqTj8G1XdvEsbDUmWNnT8CdbhVGQx7Z': {
    name: 'Identity with deleted on-chain DID',
    address: '4oESHtb7Hu6grwwQVpqTj8G1XdvEsbDUmWNnT8CdbhVGQx7Z',
    did: 'did:kilt:light:004pNrw1Jr1zWGeRJus6VLnE8cXLghtHA3J1yqqhSs7mGx2FSS',
    index: 4,
  },
  '4pzncei2Jjap98Xks5XjoBKxBeYoCzofhbki7e3sZGnqDHvK': {
    name: 'KILT Identity 5',
    address: '4pzncei2Jjap98Xks5XjoBKxBeYoCzofhbki7e3sZGnqDHvK',
    did: 'did:kilt:4sVLgckXua92XtmqkHFFG2Dn7cRafHsafvZA9Km2r597FmV5',
    index: 5,
  },
  '4sdkkaM8jvLJijJmpHmJhCDC34JvRKqqs1qLUyHYKXvygQ5w': {
    name: 'KILT Identity 6',
    address: '4sdkkaM8jvLJijJmpHmJhCDC34JvRKqqs1qLUyHYKXvygQ5w',
    did: 'did:kilt:4tPjjdrKmURbWJfvcdZ9RnK3CccVFCqRUJEEpFjZwdc7VuHp',
    index: 6,
  },
  '4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos': {
    name: 'KILT Identity 7',
    address: '4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos',
    did: 'did:kilt:4osWk37p2ut2QQpGgEumheYw9wgwSy4e9eoY9gESKqUwKFWi',
    index: 7,
  },
};

export const legacyIdentity: Identity = {
  name: 'Legacy Identity',
  address: '4s8JLRR2Q7B4XQSVzeNjj18YThACcoSFDLFMLP9qRhFZ5Bi1',
  did: 'did:kilt:4ojbz1EuSxHeKXZQN9TaMpDGw4qWRSUsVwwKLfAs5f8umt6p',
  index: 8,
};

export function IdentitiesProviderMock({
  identities = identitiesMock,
  children,
}: {
  identities?: IdentitiesMap;
  children: JSX.Element;
}): JSX.Element {
  return (
    <IdentitiesContext.Provider value={{ data: identities }}>
      {children}
    </IdentitiesContext.Provider>
  );
}
