import BN from 'bn.js';
import { KeyringPair } from '@polkadot/keyring/types';
import {
  IDidDetails,
  IDidResolvedDetails,
  SubmittableExtrinsic,
  KeyRelationship,
} from '@kiltprotocol/types';
import {
  BlockchainApiConnection,
  BlockchainUtils,
} from '@kiltprotocol/chain-helpers';
import { DidChain, FullDidDetails, DefaultResolver } from '@kiltprotocol/did';

import {
  decryptIdentity,
  getKeystoreFromKeypair,
  Identity,
  getLightDidFromKeypair,
  makeKeyring,
} from '../identities/identities';

interface DidTransaction {
  extrinsic: SubmittableExtrinsic;
  did: IDidDetails['did'];
}

const { authentication } = KeyRelationship;

export async function getDeposit(): Promise<BN> {
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  // TODO: return blockchain.api.consts.did.deposit
  return blockchain.api.consts.balances.existentialDeposit;
}

async function getSignedTransaction(
  identity: KeyringPair,
  fullDid: IDidDetails['did'],
): Promise<DidTransaction> {
  const { details: didDetails } = (await DefaultResolver.resolveDoc(
    fullDid,
  )) as IDidResolvedDetails;
  if (!didDetails) {
    throw new Error(`Cannot resolve the dApp DID ${fullDid}`);
  }

  const fullDidDetails = new FullDidDetails({
    did: didDetails.did,
    keys: didDetails.getKeys(),
    keyRelationships: {
      [authentication]: didDetails.getKeyIds(authentication),
    },
    lastTxIndex: await DidChain.queryLastTxIndex(didDetails.did),
  });

  const extrinsic = await DidChain.getDeleteDidExtrinsic();
  const keystore = getKeystoreFromKeypair(identity);

  const didAuthorizedExtrinsic = await fullDidDetails.authorizeExtrinsic(
    extrinsic,
    keystore,
    identity.address,
  );

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const tx = await blockchain.signTx(identity, didAuthorizedExtrinsic);

  const { did } = getLightDidFromKeypair(identity);
  return { extrinsic: tx, did };
}

export async function getFee(did: IDidDetails['did']): Promise<BN> {
  const fakeIdentity = makeKeyring().createFromUri('//Alice');
  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();

  const { extrinsic } = await getSignedTransaction(fakeIdentity, did);

  const { partialFee } = await blockchain.api.rpc.payment.queryInfo(
    extrinsic.toHex(),
  );
  return partialFee;
}

const currentTx: Record<string, DidTransaction> = {};

export async function sign(
  identity: Identity,
  password: string,
): Promise<string> {
  const sdkIdentity = await decryptIdentity(identity.address, password);
  const { extrinsic, did } = await getSignedTransaction(
    sdkIdentity,
    identity.did,
  );

  const hash = extrinsic.hash.toHex();
  currentTx[hash] = { extrinsic, did };
  return hash;
}

export async function submit(hash: string): Promise<string> {
  const { extrinsic, did } = currentTx[hash];
  await BlockchainUtils.submitSignedTx(extrinsic, {
    resolveOn: BlockchainUtils.IS_FINALIZED,
  });
  delete currentTx[hash];

  return did;
}
