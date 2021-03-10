import { useState, useEffect } from 'react';
import { Identity, init } from '@kiltprotocol/core';
import { loadEncrypted, saveEncrypted } from '../Hello/storageEncryption';

export function CreateAccount(): JSX.Element {
  const [mnemonic, setMnemonic] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await init({ address: 'wss://full-nodes.kilt.io:9944' });
      const mnemonic = Identity.generateMnemonic();
      console.log('Mnemonic: ', mnemonic);
      setMnemonic(mnemonic);
    })();
  }, []);

  async function handleClick() {
    setLoading(true);
    if (!password) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }

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
  }
  return (
    <>
      <p>{mnemonic}</p>
      <p>{address}</p>
      <p></p>
      <label htmlFor={password}>Enter password: </label>
      <input
        type="password"
        id={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {loading ? (
        <div>...</div>
      ) : (
        <button onClick={handleClick}>Create Account</button>
      )}
      <p style={{ color: 'red' }}>{error}</p>
    </>
  );
}
