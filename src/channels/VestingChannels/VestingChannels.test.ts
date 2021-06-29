import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { getBalances } from '@kiltprotocol/core/lib/balance/Balance.chain';
import BN from 'bn.js';

import { decryptIdentity } from '../../utilities/identities/identities';
import { originalBalancesMock } from '../balanceChangeChannel/balanceChangeChannel.mock';
import { getVestingFee, hasVestedFunds, vest } from './VestingChannels';

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

jest.mock('../../utilities/identities/identities', () => ({
  decryptIdentity: jest.fn(),
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
  partialFee: new BN(0.5e15),
};

const apiMock = {
  query: {
    vesting: { vesting: jest.fn().mockResolvedValue(vestingInfoMock) },
  },
  tx: {
    vesting: { vest: jest.fn().mockReturnValue(txMock) },
  },
  rpc: {
    payment: { queryInfo: jest.fn().mockResolvedValue(queryInfoMock) },
  },
  consts: {
    balances: { existentialDeposit: new BN(1e15) },
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

  describe('vestingFee', () => {
    it('should respond to proper message', async () => {
      const vestingFee = await getVestingFee();

      expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
        'hex transaction',
      );

      expect(vestingFee).toEqual(new BN(0.5e15));
    });
  });

  describe('vest', () => {
    it('should respond to proper message', async () => {
      const identityMock = {
        identity: true,
      };

      (decryptIdentity as jest.Mock).mockReturnValue(identityMock);

      (getBalances as jest.Mock).mockResolvedValue(originalBalancesMock);

      await vest({ address: mockAddress, password: 'password' });

      expect(decryptIdentity).toHaveBeenCalledWith(mockAddress, 'password');

      expect(apiMock.tx.vesting.vest).toHaveBeenCalled();

      expect(apiMock.rpc.payment.queryInfo).toHaveBeenCalledWith(
        'hex transaction',
      );

      expect(BlockchainUtils.signAndSubmitTx).toHaveBeenCalledWith(
        txMock,
        identityMock,
        expect.anything(),
      );

      expect(
        (BlockchainUtils.signAndSubmitTx as jest.Mock).mock.calls[0][2],
      ).toMatchObject({ tip: new BN(0.726e15) });
    });
  });
});
