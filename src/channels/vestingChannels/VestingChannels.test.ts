import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';

import { decryptAccount } from '../../utilities/accounts/accounts';
import { hasVestedFunds, vest } from './VestingChannels';
import { originalBalancesMock } from '../balanceChangeChannel/balanceChangeChannel.mock';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
  BlockchainUtils: {
    signAndSubmitTx: jest.fn(),
  },
}));

jest.mock('@kiltprotocol/core/lib/balance/Balance.chain', () => ({
  getBalances: jest.fn(),
}));

jest.mock('../../utilities/accounts/accounts', () => ({
  decryptAccount: jest.fn(),
}));

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

const vestingInfoMock = {
  isSome: true,
};

const txMock = {
  toHex() {
    return 'hex transaction';
  },
};

const queryInfoMock = {
  partialFee: new BN(125000000),
};

const apiMock = {
  query: {
    vesting: { vesting: jest.fn().mockResolvedValue(vestingInfoMock) },
  },
  tx: {
    vesting: { vest: jest.fn(() => txMock) },
  },
  rpc: {
    payment: { queryInfo: jest.fn().mockResolvedValue(queryInfoMock) },
  },
  consts: {
    balances: { existentialDeposit: new BN(500) },
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

      (getBalances as jest.Mock).mockResolvedValue(originalBalancesMock);

      const error = await vest({ address: mockAddress, password: 'password' });
      expect(error).toEqual('');

      expect(decryptAccount).toHaveBeenCalledWith(mockAddress, 'password');

      expect(apiMock.tx.vesting.vest).toHaveBeenCalled();

      expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
        'hex transaction',
      );

      expect(BlockchainUtils.signAndSubmitTx).toHaveBeenCalledWith(
        txMock,
        identityMock,
        expect.anything(),
      );
    });
  });
});
