import BN from 'bn.js';
import { BlockchainUtils } from '@kiltprotocol/chain-helpers';
import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { decryptAccount } from '../../utilities/accounts/accounts';
import { transfer } from './transferChannel';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainUtils: {
    signAndSubmitTx: jest.fn(),
  },
}));
jest.mock('../../utilities/accounts/accounts', () => ({
  decryptAccount: jest.fn(),
}));

describe('transferChannel', () => {
  describe('transferMessageListener', () => {
    it('should respond with fee to the proper messages', async () => {
      (decryptAccount as jest.Mock).mockImplementation(() => ({
        identity: true,
      }));
      (makeTransfer as jest.Mock).mockImplementation(() => ({
        transaction: true,
      }));

      const error = await transfer({
        address: 'account-address',
        recipient: 'recipient-address',
        amount: new BN(125000000),
        password: 'password',
        tip: new BN(0),
      });

      expect(error).toEqual('');
      expect(decryptAccount).toHaveBeenCalledWith(
        'account-address',
        'password',
      );
      expect(makeTransfer).toHaveBeenCalledWith(
        'recipient-address',
        expect.anything(),
      );
      expect(BlockchainUtils.signAndSubmitTx).toHaveBeenCalledWith(
        { transaction: true },
        { identity: true },
        expect.anything(),
      );
    });
  });
});
