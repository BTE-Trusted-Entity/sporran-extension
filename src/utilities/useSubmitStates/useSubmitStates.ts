import { useCallback, useState } from 'react';
import { KeyringPair } from '@polkadot/keyring/types';
import { ISubmittableResult, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { Balance } from '@kiltprotocol/core';
import BN from 'bn.js';

import { makeKeyring } from '../identities/identities';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';
import { transformBalances } from '../transformBalances/transformBalances';

async function getUnpaidCosts(
  { address }: { address: string },
  draft: SubmittableExtrinsic,
  tip = new BN(0),
): Promise<BN | undefined> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const fakeIdentity = makeKeyring().createFromUri('//Alice');
  const extrinsic = await blockchain.signTx(fakeIdentity, draft, tip);

  const fee = (await extrinsic.paymentInfo(fakeIdentity)).partialFee;

  const { transferable } = transformBalances(
    await Balance.getBalances(address),
  );
  const sufficient = transferable.gte(fee);
  if (sufficient) {
    return;
  }

  return fee;
}

async function submit(
  keypair: KeyringPair,
  draft: SubmittableExtrinsic,
  tip = new BN(0),
): Promise<{
  txHash: string;
  finalizedPromise: Promise<ISubmittableResult>;
}> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const extrinsic = await blockchain.signTx(keypair, draft, tip);

  const txHash = extrinsic.hash.toHex();

  const finalizedPromise = BlockchainUtils.submitSignedTx(extrinsic, {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });

  return {
    txHash,
    finalizedPromise,
  };
}

type Status = 'pending' | 'success' | 'error' | null;

interface SubmitStates {
  submit: (
    keypair: KeyringPair,
    draft: SubmittableExtrinsic,
    tip?: BN,
  ) => Promise<void>;
  modalProps?: {
    status: 'pending' | 'success' | 'error';
    txHash: string | undefined;
    onDismissError: () => void;
  };
  submitting: boolean;
  status: Status;
  setStatus: (status: Status) => void;
  txHash: string | undefined;
  unpaidCosts?: string;
  unpaidCostsBN?: BN;
}

export function useSubmitStates(): SubmitStates {
  const [txHash, setTxHash] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const [unpaidCostsBN, setUnpaidCostsBN] = useState<BN>();
  const unpaidCosts = unpaidCostsBN && asKiltCoins(unpaidCostsBN, 'costs');

  const submitWithStates = useCallback(
    async (keypair, draft, tip = new BN(0)) => {
      try {
        setSubmitting(true);
        setStatus('pending');

        setUnpaidCostsBN(undefined);
        const unpaid = await getUnpaidCosts(keypair, draft, tip);
        if (unpaid) {
          setUnpaidCostsBN(unpaid);
          setStatus(null);
          return;
        }

        const { txHash, finalizedPromise } = await submit(keypair, draft, tip);
        setTxHash(txHash);

        await finalizedPromise;
        setStatus('success');
      } catch (error) {
        setStatus('error');
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const onDismissError = useCallback(() => {
    setStatus(null);
  }, [setStatus]);

  const modalProps = !status
    ? undefined
    : {
        status,
        txHash,
        onDismissError,
      };

  return {
    submit: submitWithStates,
    modalProps,
    submitting,
    status,
    setStatus,
    txHash,
    unpaidCosts,
    unpaidCostsBN,
  };
}
