import { IdentitiesMap } from './types';
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
  '4ruKeJZXBuqvgTvsTpbsG1RChkTsdz1TDMGgFP7SYykK78R8': {
    name: 'KILT Identity 4',
    address: '4ruKeJZXBuqvgTvsTpbsG1RChkTsdz1TDMGgFP7SYykK78R8',
    did: 'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
    index: 4,
  },
  '4o9GN2oCv8E9GVrLMoYRgVWBYAtjXfWieKECsZmwKXevdSiV': {
    name: 'KILT Identity 5',
    address: '4o9GN2oCv8E9GVrLMoYRgVWBYAtjXfWieKECsZmwKXevdSiV',
    did: 'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
    index: 5,
  },
  '4srs2Ag4NQJyr9uDszokjT4EdiHfDHiv2hzvuZtJL7KFCVWo': {
    name: 'KILT Identity 6',
    address: '4srs2Ag4NQJyr9uDszokjT4EdiHfDHiv2hzvuZtJL7KFCVWo',
    did: 'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
    index: 6,
  },
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
