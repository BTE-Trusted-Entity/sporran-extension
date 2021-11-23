import BN from 'bn.js';
import {
  BlockchainUtils,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';
import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { signTransfer, submitTransfer } from './transfers';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
  BlockchainUtils: {
    submitSignedTx: jest.fn(),
  },
}));

const signedTxMock = {
  hash: {
    toHex() {
      return 'Signed tx hash';
    },
  },
};

const chainMock = {
  signTx: jest.fn().mockResolvedValue(signedTxMock),
};

(BlockchainApiConnection.getConnectionOrConnect as jest.Mock).mockResolvedValue(
  chainMock,
);

describe('transfers', () => {
  describe('signTransfer', () => {
    it('should return the hash of the signed transaction', async () => {
      const keypairMock = {
        sdkIdentity: true,
      } as unknown as Parameters<typeof signTransfer>[0]['keypair'];

      (makeTransfer as jest.Mock).mockImplementation(() => ({
        transaction: true,
      }));

      const txHash = await signTransfer({
        keypair: keypairMock,
        recipient: 'recipient-address',
        amount: new BN(125000000),
        tip: new BN(0),
      });

      expect(makeTransfer).toHaveBeenCalledWith(
        'recipient-address',
        expect.anything(),
      );
      expect(chainMock.signTx).toHaveBeenCalledWith(
        keypairMock,
        { transaction: true },
        expect.anything(),
      );
      expect(txHash).toEqual('Signed tx hash');
    });
  });

  describe('submitTransfer', () => {
    it('should submit the transaction', async () => {
      await submitTransfer('Signed tx hash');
      expect(BlockchainUtils.submitSignedTx).toHaveBeenCalledWith(
        signedTxMock,
        expect.anything(),
      );
    });
  });
});
