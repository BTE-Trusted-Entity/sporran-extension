import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { FeeRequest, MessageType } from '../MessageType';
import { feeListener } from './initFeeMessages';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
}));

describe('initFeeMessages', () => {
  describe('feeListener', () => {
    it('should respond with fee to the proper messages', async () => {
      const txMock = {
        toHex() {
          return 'hex transaction';
        },
      };
      const infoMock = {
        partialFee: {
          toString(radix: number) {
            return radix === 16 ? 'partial fee' : undefined;
          },
        },
      };
      const apiMock = {
        tx: { balances: { transfer: jest.fn(() => txMock) } },
        rpc: { payment: { queryInfo: jest.fn().mockResolvedValue(infoMock) } },
      };
      (BlockchainApiConnection.getConnectionOrConnect as jest.Mock).mockResolvedValue(
        { api: apiMock },
      );

      const fee = await feeListener({
        type: MessageType.feeRequest,
        data: { recipient: 'address', amount: '7735940' },
      } as FeeRequest);

      expect(fee).toEqual('partial fee');
      expect(BlockchainApiConnection.getConnectionOrConnect).toHaveBeenCalled();

      expect(apiMock.tx.balances.transfer).toHaveBeenCalledWith(
        'address',
        expect.anything(),
      );
      expect(
        (apiMock.tx.balances.transfer as jest.Mock).mock.calls[0][1].toString(
          10,
        ),
      ).toEqual('125000000');

      expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
        'hex transaction',
      );
    });

    it('should ignore other messages', async () => {
      (BlockchainApiConnection.getConnectionOrConnect as jest.Mock).mockClear();

      feeListener(({
        type: 'other',
        data: { address: 'address' },
      } as unknown) as FeeRequest);

      expect(
        BlockchainApiConnection.getConnectionOrConnect,
      ).not.toHaveBeenCalled();
    });
  });
});
