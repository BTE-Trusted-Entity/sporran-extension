import {
  Blockchain,
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { Balance } from '@kiltprotocol/core';
import BN from 'bn.js';

import { originalBalancesMock } from '../balanceChanges/balanceChanges.mock';
import { getExtrinsicFee } from '../getExtrinsicFee/getExtrinsicFee';

import { hasVestedFunds, signVest, submitVest } from './vesting';

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BlockchainApiConnection: {
    getConnectionOrConnect: jest.fn(),
  },
  BlockchainUtils: {
    submitSignedTx: jest.fn(),
  },
}));

jest.mock('@kiltprotocol/core', () => ({
  Balance: { getBalances: jest.fn() },
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

jest.mock('../getExtrinsicFee/getExtrinsicFee');
jest.mocked(getExtrinsicFee).mockResolvedValue(new BN(0.5e15));

const apiMock = {
  query: {
    vesting: { vesting: jest.fn().mockResolvedValue(vestingInfoMock) },
  },
  tx: {
    vesting: { vest: jest.fn().mockReturnValue(txMock) },
  },
};

const signedTxMock = {
  hash: {
    toHex() {
      return 'Signed tx hash';
    },
  },
  toHex() {
    return 'Signed tx hex';
  },
};

const chainMock = {
  api: apiMock,
  signTx: jest.fn().mockResolvedValue(signedTxMock),
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

  describe('signVest', () => {
    it('should return the hash of the signed transaction', async () => {
      const identityMock = {
        identity: true,
      } as unknown as Parameters<typeof signVest>[0];

      jest.mocked(Balance.getBalances).mockResolvedValue(originalBalancesMock);

      const hash = await signVest(identityMock);

      expect(apiMock.tx.vesting.vest).toHaveBeenCalled();

      expect(getExtrinsicFee).toHaveBeenCalledWith(signedTxMock);

      expect(chainMock.signTx).toHaveBeenCalledWith(identityMock, txMock);

      expect(hash).toEqual('Signed tx hash');
    });
  });

  describe('submitVest', () => {
    it('should submit the transaction', async () => {
      await submitVest('Signed tx hash');

      expect(BlockchainUtils.submitSignedTx).toHaveBeenCalledWith(
        signedTxMock,
        expect.anything(),
      );
    });
  });
});
