/**
 * This queries the KILT blockchain for DIDs with a specific public key (AFFECTED_KEY).
 * It then creates a batch extrinsic with transfers of REIMBURSEMENT_AMOUNT to the deposit owner accounts.
 * The extrinsic can be imported elsewhere and signed.
 * Creates 3 Files:
 *   - `batch.hex`: This is the hex-encoded extrinsic which you can import e.g. in the polkadot apps
 *   - `batch.json`: A human-readable version of what is included in the extrinsic. Cannot be imported.
 *   - `eligibleOwners`: A list of the did/deposit owner addresses of the affected DIDs that will receive tokens.
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import fs from 'fs';

const WS_ENDPOINT = 'wss://spiritnet.kilt.io';
const AFFECTED_KEY =
  '0xf2c90875e0630bd1700412341e5e9339a57d2fefdbba08de1cac8db5b4145f6e';
const REIMBURSEMENT_AMOUNT = 0.01; // in KILT

async function main() {
  let provider;
  let api;
  try {
    provider = new WsProvider(WS_ENDPOINT);
    api = new ApiPromise({
      provider,
    });
    await api.isReady;
    const entries = await api.query.did.did.entries();
    console.log(`Found ${entries.length} DIDs in total`);
    console.log(`Looking for public key ${AFFECTED_KEY}`);
    const eligibleDid = entries.filter(([, value]) => {
      const DidDidDetails = value.unwrap();

      const keys = [...DidDidDetails.get('publicKeys').entries()];
      return keys.some(([, key]) => {
        const keyValue = key.get('key').value.value;
        return keyValue.eq(AFFECTED_KEY);
      });
    });
    console.log(`Found ${eligibleDid.length} affected DIDs`);
    const owners = eligibleDid.map(([, value]) =>
      value.unwrap().get('deposit').get('owner'),
    );
    console.log(
      `Identified ${
        new Set(owners).size
      } individual accounts eligible for reimbursement`,
    );
    fs.writeFileSync('./eligibleOwners.json', JSON.stringify(owners));
    const transfers = owners.map((address) => {
      return api.tx.balances.transfer(address, REIMBURSEMENT_AMOUNT * 10 ** 15);
    });
    const batch = api.tx.utility.batchAll(transfers);
    fs.writeFileSync('./batch.json', JSON.stringify(batch.toHuman()));
    fs.writeFileSync('./batch.hex', batch.toHex());
    console.log('Extrinsic created. Disconnecting...');
  } catch (e) {
    console.error(`Failed with error ${e}`);
  } finally {
    if (api) {
      await api.disconnect();
    } else if (provider) {
      await provider.disconnect();
    }
    console.log('Disconnected. Done.');
  }
}
main();
