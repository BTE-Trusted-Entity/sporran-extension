import { CType } from '@kiltprotocol/core';

const mockCType = CType.fromSchema({
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
});

export const mockClaim = {
  claim: {
    cTypeHash:
      '0x240c744923bd98797504328f9bef57ca6c777f5cbf3e1aada74f348c9879d78a',
    contents: {
      'Full Name': 'Ingo Rübe',
      Email: 'ingo@kilt.io',
    },
    owner: {
      address: '4quK7LGg8iGqoH8kmeEeCDN7VM1aN5wmKkAfcH1VVU8tFmMc',
      boxPublicKeyAsHex:
        '0xe5a91394ab38253ae192d22914618ce868601d15190ca8ed35b5b81a1c9cd10e',
    },
  },
  legitimations: [],
  quote: {
    attesterSignature:
      '0x019c6604e385e3e483380f24fff4e8edeb22bc399a71288f1179867e024e7dfc43735ac6805e049fb44e0d288c334fa91bf79e81b35903bb4ccb050ead2f532a87',
    attesterAddress: '4sQR3dfZrrxobV69jQmLvArxyUto5eJtmyc2f9xs1Hc4quu3',
    cTypeHash:
      '0xbfad60977bc18cf9dfd76da88624ce219361f337b4332d5c42c047499f4b93c7',
    cost: {
      gross: 233,
      net: 23.3,
      tax: { vat: 3.3 },
    },
    currency: 'KILT',
    timeframe: new Date('2021-07-10'),
    termsAndConditions: 'https://www.example.com/terms',
  },
  cTypes: [mockCType],
  attester: 'SocialKYC',
};
