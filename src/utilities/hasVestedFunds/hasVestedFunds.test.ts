import {
  Blockchain,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';

import { hasVestedFunds } from './hasVestedFunds';

const mockAddress = '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';

const vestingInfoMock = {
  isSome: true,
};

const apiMock = {
  query: {
    vesting: { vesting: jest.fn().mockResolvedValue(vestingInfoMock) },
  },
};

const chainMock = {
  api: apiMock,
} as unknown as Blockchain;

jest
  .mocked(BlockchainApiConnection.getConnectionOrConnect)
  .mockResolvedValue(chainMock);

describe('vesting', () => {
  describe('hasVestedFunds', () => {
    it('should return true when has vested funds', async () => {
      const hasVestedFundsResult = await hasVestedFunds(mockAddress);

      expect(hasVestedFundsResult).toBe(true);
      expect(BlockchainApiConnection.getConnectionOrConnect).toHaveBeenCalled();
    });
  });
});
