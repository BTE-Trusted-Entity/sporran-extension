import { JSX } from 'react';

import { IdentitiesMap, Identity } from './types';
import { IdentitiesContext } from './IdentitiesContext';

export const identitiesMock: IdentitiesMap = {
  // pool ahead ask clock then morning invest raise atom grace fly valve
  '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1': {
    name: 'Light DID Identity',
    address: '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
    did: 'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
    index: 1,
  },
  // wasp cliff eight neck pluck baby bus elder false dwarf feed glad
  '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo': {
    name: 'Identity with on-chain DID and lots of coins',
    address: '4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo',
    did: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
    index: 2,
  },
  // price buyer view flag school busy eight unaware disagree cake fiber pencil
  '4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653': {
    name: 'Identity which has a very very very very long name and might not even fit on the screen',
    address: '4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653',
    did: 'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
    index: 3,
  },
};

export const moreIdentitiesMock: IdentitiesMap = {
  ...identitiesMock,
  // square idle twenty same argue hire surround tongue satisfy tackle silly until
  '4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB': {
    name: 'Identity with deleted on-chain DID',
    address: '4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB',
    deletedDid: 'did:kilt:4tPoYT9j4i429JktnyX9EEu9StL58YfdPCi8cUkYnvtAKRbK',
    index: 4,
  },
  // unit faint retreat broken owner conduct summer exotic comic near essay during
  '4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q': {
    name: 'Identity with web3name',
    address: '4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q',
    did: 'did:kilt:4q3VvoM6EjmbDzo7ySLQopRFm3LgS4Ehe5Kws7nsSZq4UVDp',
    index: 5,
  },
  // dune ladder ketchup toy frequent barrel gather panda mass install put coach
  '4tayr7qa5BoqQjbpDdVSkJNHYBCx9BZ2baf5fkJjFXehZKKe': {
    name: 'Identity with PROMO web3name',
    address: '4tayr7qa5BoqQjbpDdVSkJNHYBCx9BZ2baf5fkJjFXehZKKe',
    did: 'did:kilt:4oUgZPp9URmN6bDfh1M3JWyPMSvwRDVo5sdVcfZ8erpXQAut',
    index: 6,
  },
  // dad sense need library antenna spider cactus hurry sleep you august poverty
  '4p273cfeZ2JRz46AcJoQvTRHCH8Vaj92jts2VxepZtQwbTBB': {
    name: 'Identity with PROMO on-chain DID',
    address: '4p273cfeZ2JRz46AcJoQvTRHCH8Vaj92jts2VxepZtQwbTBB',
    did: 'did:kilt:4sV7gtM8JCLSSNxCMDr4mccHvetxWKNyT72h4ykEkfdJyTZH',
    index: 7,
  },
  // doll begin alone turn audit radar dismiss vivid toddler laugh stand advance
  '4su6rRjEVPfNYCuaXw7iF3os1REHE6Gan23mYo2vc6fT7jZq': {
    name: 'Identity with PROMO on-chain DID AND PROMO web3name',
    address: '4su6rRjEVPfNYCuaXw7iF3os1REHE6Gan23mYo2vc6fT7jZq',
    did: 'did:kilt:4tFY7xFap6VWDsAcfSB3yXpio9FzReAfLPm8omd9BzzaWTqh',
    index: 8,
  },
};

export const legacyIdentity: Identity = {
  // session stage peanut cross say entire behave require rather whale corn beauty
  name: 'Legacy Identity',
  address: '4qp7KB8jbwqS6XXL8zH8qZn3GCdnZDt6Nmq5M47ztGKhXJVh',
  did: 'did:kilt:4pTdRYFnieqTHgAyS9PijMjnH8hXonJ6iEvi32trwAPkoFtF',
  index: 9,
};

export function IdentitiesProviderMock({
  identities = identitiesMock,
  children,
}: {
  identities?: IdentitiesMap;
  children: JSX.Element;
}): JSX.Element {
  return (
    <IdentitiesContext.Provider value={{ data: identities }}>
      {children}
    </IdentitiesContext.Provider>
  );
}
