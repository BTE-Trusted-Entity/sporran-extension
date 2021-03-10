import { useState, useEffect, useCallback } from 'react';
import { Identity, init } from '@kiltprotocol/core';
import { ClipLoader } from 'react-spinners';

import { loadEncrypted, saveEncrypted } from '../Hello/storageEncryption';

export function CreateAccount(): JSX.Element {
  const [mnemonic, setMnemonic] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      // TODO: move address to config file
      await init({ address: 'wss://full-nodes.kilt.io:9944' });
      const mnemonic = Identity.generateMnemonic();
      console.log('Mnemonic: ', mnemonic);
      setMnemonic(mnemonic);
    })();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      const identity = Identity.buildFromMnemonic(mnemonic);
      const { address, seed } = identity;
      console.log('Identity to save: ', identity);

      await saveEncrypted(address, password, seed);

      const loaded = await loadEncrypted(address, password);
      const loadedSeed = new Uint8Array(loaded);
      const identityFromLoadedData = Identity.buildFromSeed(loadedSeed);
      console.log('Loaded identity: ', identityFromLoadedData);
      console.log(
        'Same address? ',
        identity.address === identityFromLoadedData.address,
      );
      setAddress(identityFromLoadedData.address);

      setLoading(false);
    },
    [password],
  );
  return (
    <>
      <p>{mnemonic}</p>
      <p>{address}</p>
      {address ? (
        <p style={{ color: 'green' }}>Account creation successful!</p>
      ) : loading ? (
        <ClipLoader />
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Enter password:
            <input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={!password}>
            Create Account
          </button>
        </form>
      )}
    </>
  );
}
