import { FC, useEffect, useState } from 'react';
import { Identity, init } from '@kiltprotocol/core';

export const CreateAccount: FC = () => {
  const [mnemonic, setMnemonic] = useState<string>();
  const [address, setAddress] = useState<string>();
  useEffect(() => {
    (async () => {
      // TODO: move URI to config
      await init({ address: 'wss://full-nodes.kilt.io:9944' });
      const mnemonic = Identity.generateMnemonic();
      setMnemonic(mnemonic);
      console.log('Mnemonic: ', mnemonic);
      const identity = Identity.buildFromMnemonic(mnemonic);
      setAddress(identity.address);
      console.log('Claimer identity: ', identity);
    })();
  }, []);
  return (
    <>
      <h1>{mnemonic}</h1>
      <h1>{address}</h1>
    </>
  );
};
