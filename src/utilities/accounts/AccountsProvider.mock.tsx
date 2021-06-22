import { AccountsMap } from './accounts';
import { AccountsContext } from './AccountsContext';

export const accountsMock: AccountsMap = {
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
    name: 'My Sporran Account',
    address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
    index: 1,
  },
  '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
    name: 'My Second Account',
    address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
    index: 2,
  },
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
    name: 'My Third Account which has a very long name and might not even fit on the screen',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
    index: 3,
  },
};

export const moreAccountsMock: AccountsMap = {
  ...accountsMock,
  '4ruKeJZXBuqvgTvsTpbsG1RChkTsdz1TDMGgFP7SYykK78R8': {
    name: 'My Fourth Account',
    address: '4ruKeJZXBuqvgTvsTpbsG1RChkTsdz1TDMGgFP7SYykK78R8',
    index: 4,
  },
  '4o9GN2oCv8E9GVrLMoYRgVWBYAtjXfWieKECsZmwKXevdSiV': {
    name: 'My Fifth Account',
    address: '4o9GN2oCv8E9GVrLMoYRgVWBYAtjXfWieKECsZmwKXevdSiV',
    index: 5,
  },
  '4srs2Ag4NQJyr9uDszokjT4EdiHfDHiv2hzvuZtJL7KFCVWo': {
    name: 'My Sixth Account',
    address: '4srs2Ag4NQJyr9uDszokjT4EdiHfDHiv2hzvuZtJL7KFCVWo',
    index: 6,
  },
};

export function AccountsProviderMock({
  accounts = accountsMock,
  children,
}: {
  accounts?: AccountsMap;
  children: JSX.Element;
}): JSX.Element {
  return (
    <AccountsContext.Provider value={{ data: accounts }}>
      {children}
    </AccountsContext.Provider>
  );
}
