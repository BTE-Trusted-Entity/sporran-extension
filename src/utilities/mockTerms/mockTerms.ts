import type { Did, ICType } from '@kiltprotocol/types';

import { identitiesMock } from '../identities/IdentitiesProvider.mock';
import { Terms } from '../../views/SignQuote/SignQuote';

export const mockCType: ICType = {
  $id: 'kilt:ctype:0x240c744923bd98797504328f9bef57ca6c777f5cbf3e1aada74f348c9879d78a',
  $schema: 'http://kilt-protocol.org/draft-01/ctype#',
  title: 'BL-Mail-Simple',
  properties: {
    'Full name': {
      type: 'string',
    },
    Email: {
      type: 'string',
    },
  },
  type: 'object',
};

export const mockTerms: Terms = {
  claim: {
    cTypeHash:
      '0x240c744923bd98797504328f9bef57ca6c777f5cbf3e1aada74f348c9879d78a',
    contents: {
      'Full Name': 'Ingo Rübe',
      Email: 'ingo@kilt.io',
    },
    owner: identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
      .did as Did,
  },
  legitimations: [],
  quote: {
    attesterSignature: {
      keyUri:
        'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ#0x59a56e1a4017b60a00c5450bfd6af21dc753e84ef72f2fd45dfc27dd5c3bdafb',
      signature:
        '0x30d01aefd64c7eea48bc743782fe54ba58f96b5a91e33d8d9ee5fae282964967bdea5e9ac3f31756fd251a40ea4d2e9a93ac9b1314cc037cdcb04a53a007e68f',
    },
    attesterDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
    cTypeHash:
      '0xbfad60977bc18cf9dfd76da88624ce219361f337b4332d5c42c047499f4b93c7',
    cost: {
      gross: 233,
      net: 23.3,
      tax: { vat: 3.3 },
    },
    currency: 'KILT',
    timeframe: 'Sat Jul 10 2021 00:00:00 GMT+0000 (Coordinated Universal Time)',
    termsAndConditions: 'https://www.example.com/terms',
  },
  cTypes: [mockCType],
  attesterName: 'SocialKYC',
  attesterDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
  specVersion: '3.0',
};
