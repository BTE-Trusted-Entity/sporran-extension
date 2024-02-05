import { ConfigService, connect } from '@kiltprotocol/sdk-js';

import { computeBalance, onAddressBalanceChange } from './balanceChanges';
import { originalBalancesMock } from './balanceChanges.mock';

const api = {
  query: {
    system: { account: jest.fn() },
  },
} as unknown as Awaited<ReturnType<typeof connect>>;
ConfigService.set({ api });

jest.unmock('./balanceChanges');

const expectedBalanceStrings = {
  transferable: '1216000000000000',
  frozen: '10000000000000',
  bonded: '8000000000000',
  total: '1234000000000000',
};

describe('balanceChanges', () => {
  describe('computeBalance', () => {
    it('should send runtime message', async () => {
      const { balances } = await computeBalance(
        'address',
        originalBalancesMock,
      );

      expect(expectedBalanceStrings).toEqual({
        bonded: balances.bonded.toString(),
        transferable: balances.transferable.toString(),
        frozen: balances.frozen.toString(),
        total: balances.total.toString(),
      });
    });
  });

  describe('onAddressBalanceChange', () => {
    it('should start listening when called', async () => {
      onAddressBalanceChange('address', jest.fn());

      expect(api.query.system.account).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
    });

    it('should run publisher on balance change', async () => {
      jest.mocked(api.query.system.account).mockClear();

      const publisher = jest.fn();
      onAddressBalanceChange('address', publisher);

      jest
        .mocked(api.query.system.account)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .mock.calls[0][1]({ data: originalBalancesMock });

      const { balances } = publisher.mock.calls[0][1];
      expect(expectedBalanceStrings).toEqual({
        bonded: balances.bonded.toString(),
        transferable: balances.transferable.toString(),
        frozen: balances.frozen.toString(),
        total: balances.total.toString(),
      });
    });
  });
});
