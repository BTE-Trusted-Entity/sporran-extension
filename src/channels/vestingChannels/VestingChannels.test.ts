import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';

import { decryptAccount } from '../../utilities/accounts/accounts';
import { hasVestedFunds, vest } from './VestingChannels';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
  BlockchainUtils: {
    signAndSubmitTx: jest.fn(),
  },
}));

jest.mock('../../utilities/accounts/accounts', () => ({
  decryptAccount: jest.fn(),
}));

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

const queryResultMock = {
  isSome: true,
};

const transactionMock = {
  transaction: true,
};

const apiMock = {
  query: {
    vesting: { vesting: jest.fn().mockResolvedValue(queryResultMock) },
  },
  tx: {
    vesting: {
      vest: jest.fn(() => transactionMock),
    },
  },
};

(BlockchainApiConnection.getConnectionOrConnect as jest.Mock).mockResolvedValue(
  { api: apiMock },
);

describe('VestingChannels', () => {
  describe('hasVestedFunds', () => {
    it('should respond to proper message', async () => {
      const hasVestedFundsResult = await hasVestedFunds(mockAddress);

      expect(hasVestedFundsResult).toBe(true);
      expect(BlockchainApiConnection.getConnectionOrConnect).toHaveBeenCalled();
    });
  });
  describe('vest', () => {
    it('should respond to proper message', async () => {
      const identityMock = {
        identity: true,
      };

      (decryptAccount as jest.Mock).mockImplementation(() => identityMock);

      const error = await vest({ address: mockAddress, password: 'password' });
      expect(error).toEqual('');

      expect(decryptAccount).toHaveBeenCalledWith(mockAddress, 'password');

      expect(BlockchainUtils.signAndSubmitTx).toHaveBeenCalledWith(
        transactionMock,
        identityMock,
        expect.anything(),
      );
    });
  });
});
