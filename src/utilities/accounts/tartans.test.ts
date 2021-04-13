import { getAccounts } from './getAccounts';
import { accountsMock } from '../../testing/AccountsProviderMock';
import { storage } from './storage';
import { updateNextTartan, otherTartans } from './tartans';

const addedAccount = {
  '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtC': {
    name: 'My Sixth Account',
    tartan: 'MacIntyre',
    address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtC',
    index: 6,
  },
};

jest.mock('./getAccounts');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockStorage: { [key: string]: any } = {
  nextTartan: undefined,
};

jest.spyOn(storage, 'set').mockImplementation(async (value) => {
  mockStorage.nextTartan = value.nextTartan;
});

jest.spyOn(storage, 'get').mockImplementation(async () => mockStorage);

describe('tartans', () => {
  it('should set last remaining popular tartan as next tartan', async () => {
    (getAccounts as jest.Mock).mockReturnValue(accountsMock);

    await updateNextTartan();
    expect(storage.set).toHaveBeenCalledWith({ nextTartan: 'MacIntyre' });
    expect(mockStorage.nextTartan).toBe('MacIntyre');
  });
  it('should use other tartan after all popular tartans are used', async () => {
    (getAccounts as jest.Mock).mockReturnValue({
      ...accountsMock,
      ...addedAccount,
    });

    await updateNextTartan();
    expect(otherTartans).toContain(mockStorage.nextTartan);
  });
});
