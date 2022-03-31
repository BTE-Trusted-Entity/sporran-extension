import BN from 'bn.js';
import {
  Blockchain,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';
import { BalanceUtils } from '@kiltprotocol/core';
import { Keyring } from '@polkadot/keyring';

import { makeKeyring } from '../identities/identities';

import { getFee } from './getFee';

jest.mock('../../utilities/identities/identities');

describe('getFee', () => {
  it('should respond with fee to the proper messages', async () => {
    const txMock = {
      toHex() {
        return 'hex transaction';
      },
    };
    const apiMock = {
      tx: { balances: { transfer: jest.fn().mockReturnValue(txMock) } },
    };

    const signedTxMock = {
      async paymentInfo() {
        return {
          partialFee: {
            toString() {
              return 'partial fee';
            },
          } as BN,
        };
      },
    };
    const blockchainMock = {
      api: apiMock,
      signTx: jest.fn().mockResolvedValue(signedTxMock),
    };

    jest
      .mocked(BlockchainApiConnection.getConnectionOrConnect)
      .mockResolvedValue(blockchainMock as unknown as Blockchain);

    const identityMock = { Alice: true };
    jest.mocked(makeKeyring).mockReturnValue({
      createFromUri: () => identityMock,
    } as unknown as Keyring);

    const fee = await getFee({
      recipient: 'address',
      amount: BalanceUtils.toFemtoKilt(0.000000125),
      tip: BalanceUtils.toFemtoKilt(0.000000000025),
    });

    expect(fee.toString()).toEqual('partial fee');
    expect(BlockchainApiConnection.getConnectionOrConnect).toHaveBeenCalled();

    const transfer = apiMock.tx.balances.transfer;
    expect(transfer).toHaveBeenCalledWith('address', expect.anything());

    const args = jest.mocked(transfer).mock.calls?.[0];
    expect(args?.[1]?.toString(10)).toEqual('125000000');

    expect(blockchainMock.signTx).toHaveBeenCalledWith(
      identityMock,
      txMock,
      expect.anything(),
    );
  });
});
