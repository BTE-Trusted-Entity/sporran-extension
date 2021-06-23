import BN from 'bn.js';
import { BlockchainUtils } from '@kiltprotocol/chain-helpers';
import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { decryptIdentity } from '../../utilities/identities/identities';
import { transfer } from './transferChannel';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainUtils: {
    signAndSubmitTx: jest.fn(),
  },
}));
jest.mock('../../utilities/identities/identities', () => ({
  decryptIdentity: jest.fn(),
}));

describe('transferChannel', () => {
  describe('transferMessageListener', () => {
    it('should respond with fee to the proper messages', async () => {
      (decryptIdentity as jest.Mock).mockImplementation(() => ({
        sdkIdentity: true,
      }));
      (makeTransfer as jest.Mock).mockImplementation(() => ({
        transaction: true,
      }));

      await transfer({
        address: 'identity-address',
        recipient: 'recipient-address',
        amount: new BN(125000000),
        password: 'password',
        tip: new BN(0),
      });

      expect(decryptIdentity).toHaveBeenCalledWith(
        'identity-address',
        'password',
      );
      expect(makeTransfer).toHaveBeenCalledWith(
        'recipient-address',
        expect.anything(),
      );
      expect(BlockchainUtils.signAndSubmitTx).toHaveBeenCalledWith(
        { transaction: true },
        { sdkIdentity: true },
        expect.anything(),
      );
    });
  });
});
