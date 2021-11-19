import { useCallback, useState } from 'react';
import { KeyringPair } from '@polkadot/keyring/types';
import { ISubmittableResult, SubmittableExtrinsic } from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';

async function submit(
  keypair: KeyringPair,
  draft: SubmittableExtrinsic,
): Promise<{
  txHash: string;
  finalizedPromise: Promise<ISubmittableResult>;
}> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const extrinsic = await blockchain.signTx(keypair, draft);

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
  submit: (keypair: KeyringPair, draft: SubmittableExtrinsic) => Promise<void>;
  modalProps?: {
    status: 'pending' | 'success' | 'error';
    txHash: string | undefined;
    onDismissError: () => void;
  };
  submitting: boolean;
  status: Status;
  setStatus: (status: Status) => void;
  txHash: string | undefined;
}

export function useSubmitStates(): SubmitStates {
  const [txHash, setTxHash] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const submitWithStates = useCallback(async (keypair, draft) => {
    try {
      setSubmitting(true);
      setStatus('pending');

      const { txHash, finalizedPromise } = await submit(keypair, draft);
      setTxHash(txHash);

      await finalizedPromise;
      setStatus('success');
    } catch (error) {
      setSubmitting(false);
      setStatus('error');
    }
  }, []);

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
  };
}
