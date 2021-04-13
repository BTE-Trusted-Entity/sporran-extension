import { getAccounts } from './getAccounts';
import { accountsMock } from '../../testing/AccountsProviderMock';
import { storage } from './storage';
import { updateNextTartan } from './tartans';

jest.mock('./getAccounts');
jest.mock('./storage');

const firstAccount =
  accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('tartans', () => {
  beforeEach(() => {
    (storage.set as jest.Mock).mockClear();
  });

  it('should set last remaining popular tartan as next tartan', async () => {
    const accounts = { ...accountsMock };
    ['MacLeod', 'MacGregor'].forEach((tartan) => {
      accounts[tartan] = { ...firstAccount, tartan };
    });
    (getAccounts as jest.Mock).mockReturnValue(accounts);

    await updateNextTartan();
    expect(storage.set).toHaveBeenCalledWith({ nextTartan: 'MacIntyre' });
  });
  it('should use other tartan after all popular tartans are used', async () => {
    const accounts = { ...accountsMock };
    ['MacLeod', 'MacGregor', 'MacIntyre'].forEach((tartan) => {
      accounts[tartan] = { ...firstAccount, tartan };
    });
    (getAccounts as jest.Mock).mockReturnValue(accounts);

    await updateNextTartan();
    expect(storage.set).not.toHaveBeenCalledWith({ nextTartan: 'MacLeod' });
    expect(storage.set).not.toHaveBeenCalledWith({ nextTartan: 'MacIntyre' });
    expect(storage.set).not.toHaveBeenCalledWith({ nextTartan: 'MacFarlane' });
    expect(storage.set).not.toHaveBeenCalledWith({ nextTartan: 'MacLachlan' });
    expect(storage.set).not.toHaveBeenCalledWith({ nextTartan: 'MacPherson' });
    expect(storage.set).not.toHaveBeenCalledWith({ nextTartan: 'MacGregor' });
  });
});
