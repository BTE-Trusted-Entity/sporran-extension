import { IdentitiesMap } from './identities';
import { IdentitiesContext } from './IdentitiesContext';

export const identitiesMock: IdentitiesMap = {
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
    name: 'My Sporran Identity',
    address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
    index: 1,
  },
  '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
    name: 'My Second Identity',
    address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
    index: 2,
  },
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
    name: 'My Third Identity which has a very long name and might not even fit on the screen',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
    index: 3,
  },
};

export const moreIdentitiesMock: IdentitiesMap = {
  ...identitiesMock,
  '4ruKeJZXBuqvgTvsTpbsG1RChkTsdz1TDMGgFP7SYykK78R8': {
    name: 'My Fourth Identity',
    address: '4ruKeJZXBuqvgTvsTpbsG1RChkTsdz1TDMGgFP7SYykK78R8',
    index: 4,
  },
  '4o9GN2oCv8E9GVrLMoYRgVWBYAtjXfWieKECsZmwKXevdSiV': {
    name: 'My Fifth Identity',
    address: '4o9GN2oCv8E9GVrLMoYRgVWBYAtjXfWieKECsZmwKXevdSiV',
    index: 5,
  },
  '4srs2Ag4NQJyr9uDszokjT4EdiHfDHiv2hzvuZtJL7KFCVWo': {
    name: 'My Sixth Identity',
    address: '4srs2Ag4NQJyr9uDszokjT4EdiHfDHiv2hzvuZtJL7KFCVWo',
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
