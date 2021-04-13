import { getAccounts } from './getAccounts';
import { accountsMock } from '../../testing/AccountsProviderMock';
import { storage } from './storage';
import { updateNextTartan, otherTartans } from './tartans';

jest.mock('./getAccounts');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockStorage: { [key: string]: any } = {
  nextTartan: undefined,
};

jest.spyOn(storage, 'set').mockImplementation(async (value) => {
  mockStorage.nextTartan = value.nextTartan;
});

jest.spyOn(storage, 'get').mockImplementation(async () => mockStorage);

const firstAccount =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('tartans', () => {
  it('should set last remaining popular tartan as next tartan', async () => {
    const accounts = { ...accountsMock };
    ['MacLeod', 'MacGregor'].forEach((tartan) => {
      accounts[tartan] = { ...firstAccount, tartan };
    });
    (getAccounts as jest.Mock).mockReturnValue(accounts);

    await updateNextTartan();
    expect(storage.set).toHaveBeenCalledWith({ nextTartan: 'MacIntyre' });
    expect(mockStorage.nextTartan).toBe('MacIntyre');
  });
  it('should use other tartan after all popular tartans are used', async () => {
    const accounts = { ...accountsMock };
    ['MacLeod', 'MacGregor', 'MacIntyre'].forEach((tartan) => {
      accounts[tartan] = { ...firstAccount, tartan };
    });
    (getAccounts as jest.Mock).mockReturnValue(accounts);

    await updateNextTartan();
    expect(otherTartans).toContain(mockStorage.nextTartan);
  });
});
