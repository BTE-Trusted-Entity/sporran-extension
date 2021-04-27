import { BlockchainUtils } from '@kiltprotocol/chain-helpers';
import { makeTransfer } from '@kiltprotocol/core/lib/balance/Balance.chain';

import { decryptAccount } from '../../utilities/accounts/accounts';
import { MessageType, TransferRequest } from '../MessageType';
import { transferListener } from './initTransferMessages';

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain');
jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainUtils: {
    submitTxWithReSign: jest.fn(),
  },
}));
jest.mock('../../utilities/accounts/accounts', () => ({
  decryptAccount: jest.fn(),
}));

describe('initTransferMessages', () => {
  describe('transferListener', () => {
    it('should respond with fee to the proper messages', async () => {
      (decryptAccount as jest.Mock).mockImplementation(() => ({
        identity: true,
      }));
      (makeTransfer as jest.Mock).mockImplementation(() => ({
        transaction: true,
      }));

      const error = await transferListener({
        type: MessageType.transferRequest,
        data: {
          address: 'account-address',
          recipient: 'recipient-address',
          amount: '7735940',
          password: 'password',
          tip: '0',
        },
      } as TransferRequest);

      expect(error).toEqual('');
      expect(decryptAccount).toHaveBeenCalledWith(
        'account-address',
        'password',
      );
      expect(makeTransfer).toHaveBeenCalledWith(
        { identity: true },
        'recipient-address',
        expect.anything(),
      );
      expect(BlockchainUtils.submitTxWithReSign).toHaveBeenCalledWith(
        { transaction: true },
        { identity: true },
        expect.anything(),
      );
    });

    it('should ignore other messages', async () => {
      (decryptAccount as jest.Mock).mockClear();

      transferListener(({
        type: 'other',
        data: { address: 'address' },
      } as unknown) as TransferRequest);

      expect(decryptAccount).not.toHaveBeenCalled();
    });
  });
});
