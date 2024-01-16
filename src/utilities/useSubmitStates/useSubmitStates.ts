import type {
  ISubmittableResult,
  KiltKeyringPair,
  SubmittableExtrinsic,
} from '@kiltprotocol/types';

import { useCallback, useState } from 'react';
import BN from 'bn.js';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { Blockchain } from '@kiltprotocol/chain-helpers';

import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';
import { transformBalances } from '../transformBalances/transformBalances';
import { makeFakeIdentityCrypto } from '../makeFakeIdentityCrypto/makeFakeIdentityCrypto';

async function getUnpaidCosts(
  { address }: { address: string },
  draft: SubmittableExtrinsic,
  tip = new BN(0),
): Promise<BN | undefined> {
  const { keypair } = await makeFakeIdentityCrypto();
  const extrinsic = await draft.signAsync(keypair, { tip });

  const fee = (await extrinsic.paymentInfo(keypair)).partialFee;

  const api = ConfigService.get('api');
  const { usableForFees } = transformBalances(
    (await api.query.system.account(address)).data,
  );
  const sufficient = usableForFees.gte(fee);
  if (sufficient) {
    return;
  }

  return fee;
}

async function submit(
  keypair: KiltKeyringPair,
  draft: SubmittableExtrinsic,
  tip = new BN(0),
): Promise<{
  txHash: string;
  finalizedPromise: Promise<ISubmittableResult>;
}> {
  const extrinsic = await draft.signAsync(keypair, { tip });

  const txHash = extrinsic.hash.toHex();

  const finalizedPromise = Blockchain.submitSignedTx(extrinsic);

  return {
    txHash,
    finalizedPromise,
  };
}

type Status = 'pending' | 'success' | 'error' | null;

interface SubmitStates {
  submit: (
    keypair: KiltKeyringPair,
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
    async (
      keypair: KiltKeyringPair,
      draft: SubmittableExtrinsic,
      tip = new BN(0),
    ) => {
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
