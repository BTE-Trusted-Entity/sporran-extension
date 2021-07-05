import BN from 'bn.js';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { Identity } from '@kiltprotocol/core';

import { getFee } from './feeChannel';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
}));
jest.mock('@kiltprotocol/core', () => ({
  Identity: {
    buildFromURI: jest.fn(),
  },
}));

describe('feeChannel', () => {
  describe('getFee', () => {
    it('should respond with fee to the proper messages', async () => {
      const txMock = {
        toHex() {
          return 'hex transaction';
        },
      };
      const infoMock = {
        partialFee: {
          toString() {
            return 'partial fee';
          },
        },
      };
      const apiMock = {
        tx: { balances: { transfer: jest.fn(() => txMock) } },
        rpc: { payment: { queryInfo: jest.fn().mockResolvedValue(infoMock) } },
      };

      const signedTxMock = {
        toHex() {
          return 'Signed tx hash';
        },
      };
      const blockchainMock = {
        api: apiMock,
        signTx: jest.fn().mockResolvedValue(signedTxMock),
      };

      (
        BlockchainApiConnection.getConnectionOrConnect as jest.Mock
      ).mockResolvedValue(blockchainMock);

      const identityMock = { Alice: true };
      (Identity.buildFromURI as jest.Mock).mockReturnValue(identityMock);

      const fee = await getFee({
        recipient: 'address',
        amount: new BN(125000000),
        tip: new BN(250000),
      });

      expect(fee.toString()).toEqual('partial fee');
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

      expect(blockchainMock.signTx).toHaveBeenCalledWith(
        identityMock,
        txMock,
        expect.anything(),
      );
      expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
        'Signed tx hash',
      );
    });
  });
});
