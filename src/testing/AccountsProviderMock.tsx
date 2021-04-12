import { AccountsMap } from '../utilities/accounts/accounts';
import { AccountsContext } from '../utilities/accounts/AccountsContext';

export const accountsMock: AccountsMap = {
  '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
    name: 'My Sporran Account',
    tartan: 'MacFarlane',
    address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
    index: 1,
  },
  '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
    name: 'My Second Account',
    tartan: 'MacLachlan',
    address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
    index: 2,
  },
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
    name: 'My Third Account',
    tartan: 'MacPherson',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
    index: 3,
  },
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtA': {
    name: 'My Fourth Account',
    tartan: 'MacLeod',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtA',
    index: 4,
  },
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtB': {
    name: 'My Fifth Account',
    tartan: 'MacGregor',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtB',
    index: 5,
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
