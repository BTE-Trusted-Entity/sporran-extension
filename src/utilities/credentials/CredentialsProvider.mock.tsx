import { IAttestation } from '@kiltprotocol/sdk-js';

import { ShareInput } from '../../channels/shareChannel/types';

import { SporranCredential } from './credentials';
import { CredentialsContext } from './CredentialsContext';

export const credentialsMock: SporranCredential[] = [
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'mockEmail@mock.mock',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae',
    },
    name: 'Email Credential',
    cTypeTitle: 'Email',
    attester: 'Trusted Entity attester',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'badboy69@hotmail.com',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700daf',
    },
    name: 'Alter Ego Email',
    cTypeTitle: 'Email',
    attester: 'Anonymous',
    status: 'pending',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'sporran@sporran.org',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dag',
    },
    name: 'Sporran email',
    cTypeTitle: 'Email',
    attester: 'Social KYC',
    status: 'revoked',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'loremipsum@gmail.com',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700foo',
    },
    name: 'A really long name for my credential which probably will not fit on the screen',
    cTypeTitle: 'Email',
    attester: 'Lorem Ipsum',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'maxmustermann@gmx-123-z34-dfdsafsdf-42r421-2sdfag.de',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700bar',
    },
    name: 'Mein Credential',
    cTypeTitle: 'Email',
    attester: 'Beamter #45065-2',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x47d04c42bdf7fdd3fc5a194bcaa367b2f4766a6b16ae3df628927656d818f420',
        contents: {
          Twitter: 'tweety_bird',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dah',
    },
    name: 'Tweet Twit Twat',
    cTypeTitle: 'Twitter',
    attester: 'Social KYC',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x47d04c42bdf7fdd3fc5a194bcaa367b2f4766a6b16ae3df628927656d818f420',
        contents: {
          Twitter: 'realDonaldTrump',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dai',
    },
    name: 'Believe me',
    cTypeTitle: 'Twitter',
    attester: 'Fake news',
    status: 'revoked',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x55c1dd2f28ae7fc2376dda1c01bf94658fccd80d3fc6685b3a17427797e845a2',
        contents: {
          Name: 'God collator',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700daj',
    },
    name: 'Dotsama Credential',
    cTypeTitle: 'Dotsama',
    attester: 'Myself',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x55c1dd2f28ae7fc2376dda1c01bf94658fccd80d3fc6685b3a17427797e845a2',
        contents: {
          Name: 'This is a really long name for the first property of claim contents to check how the overflow looks',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dak',
    },
    name: 'All your stakes are belong to us',
    cTypeTitle: 'Dotsama',
    attester: 'Foo',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x55c1dd2f28ae7fc2376dda1c01bf94658fccd80d3fc6685b3a17427797e845a3',
        contents: {
          Name: 'Proppy',
          PropA: 'Here is a prop',
          PropB: 'Here is another prop',
          PropC: 'Here is yet another prop',
          'Prop D has a long name to test how the overflow works here as well':
            'This is prop D',
          PropE: 'Prop E',
        },
        owner:
          'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dal',
    },
    name: 'Lots of props',
    cTypeTitle: 'Lots of props',
    attester: 'Trustity entity attester',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'sporran@sporran.org',
        },
        owner: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dam',
    },
    name: 'Sporran email',
    cTypeTitle: 'Email',
    attester: 'Social KYC',
    status: 'revoked',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'mockEmail@mock.mock',
        },
        owner: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dan',
    },
    name: 'Email Credential',
    cTypeTitle: 'Email',
    attester: 'Trusted Entity attester',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0xad52bd7a8bd8a52e03181a99d2743e00d0a5e96fdc0182626655fcf0c0a776d0',
        contents: { 'User ID': '28846466', Username: 'lukeg90' },
        owner: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
      },
      claimHashes: [
        '0x66c9d9d95ebd89a0d4d0281b409e0ba0dc04b97bced30a586ee5a447d24bc58a',
        '0x7097b65bfeec702611e428a88de28be75de5b3a02feefacc4bcd8285209d4861',
        '0xf2335b05e532acf965883211228d2b171478d248cb2387353a9c2330b9323dfe',
      ],
      claimNonceMap: {
        '0x0d043bde638b3bdd0651b1efc55186ae3b24534df654eb82778266fe9f1ee99a':
          '0f88ac22-de8a-4c7c-bf7e-b3d781ca7433',
        '0x01e659b349b968513737a0b7e821b4dfbdcd11d006429e31f9bdce7921fea236':
          '1d762863-4971-4833-8fa8-8af674a65189',
        '0xe524f074aa073fd96a6dc1f488c29d64c8d863b9e6b1ad18ec942c2d944a5800':
          '86b324d3-a8f0-4251-9227-0d1dbf3e2f9e',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0xe4cc9f4eebf1112b3f26ad6bde36ef95ea79d544c481270f62a50d699fac819b',
    },
    name: 'GitHub 1',
    cTypeTitle: 'GitHub',
    attester: 'SocialKYC',
    status: 'attested',
    isDownloaded: true,
  },
  {
    credential: {
      claim: {
        cTypeHash:
          '0xad52bd7a8bd8a52e03181a99d2743e00d0a5e96fdc0182626655fcf0c0a776d0',
        contents: {
          Username: 'arty-name',
          'User ID': '133055',
        },
        owner: 'did:kilt:4rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR5E',
      },
      legitimations: [],
      claimHashes: [
        '0x73ab53e3e87960ae33b827d8bde3fee2717cfd5af2841d7dfc163a0eeed85474',
        '0xbd0d90cff6b3784e9e53afb0499076902c677c992c472b9f4aac87fe0f700709',
        '0xfacb2590ec33b9c5c1cd37bc5da8023629052d1fd593f4b9fb5c3271e7bee146',
      ],
      claimNonceMap: {
        '0x39df1673e48bcdf17a1eff936fbe2460555de5bdc029b515afd25bb81012ebcd':
          '56ea4c72-caa8-425a-9def-fa5ea5571fcc',
        '0xc9cccabfbfc0c529263c97d9775ed8297df7832d53948229c7282667c2d15f7c':
          'd6faf781-9a0c-4f10-a58d-591f35f3f6ad',
        '0x800e8346b87610819d18304201c9aaee24ef2f69769e86713928937e37ffff99':
          '4a4d173c-c348-4c24-b974-9c6e84817a92',
      },
      rootHash:
        '0x202b70def75caa7d2130524b12d759e711ebf75960e838cbbc27d657560e6675',
      delegationId: null,
    },
    name: 'GitHub 2',
    cTypeTitle: 'GitHub',
    attester: 'SocialKYC',
    status: 'rejected',
    isDownloaded: true,
  },
];

export const notDownloaded: SporranCredential[] = [
  {
    credential: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'mockEmail@mock.mock',
        },
        owner: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
      },
      claimHashes: [
        '0x144597d2845e325dffd4e51a94e3e9c04b52dc1573e66afc693846d91f31a713',
        '0x3177ea41f76d066d19123c2cb0de13a37d63906d2c519e36fbfd7773fac1b718',
        '0x9d2dcaf5238d6bc4bcf0328aedb1689436e077ebf6198b6c4e961664807eaedf',
        '0xcee193ffdfa63487907dfe0848ae150d4a7196cc1e3d5bd2c89becb5402efc07',
      ],
      claimNonceMap: {
        '0x57458a6972e78223cd4f7f4c59236ea76f387ae571ab7e79460f56f2aa97623f':
          'd0c9d647-42ef-4d44-b603-3b776260a6dd',
        '0xcefe2b88d10834869dad3e8d7306f5aa99a1f078214adeae79cbeed303e638af':
          '6b62308c-8557-4b61-ac02-8f905555d67b',
        '0x8be32d7e9cc5015bf71b5c45550a8790c43b9a26dbfa9a8523871211745d33a3':
          '247394c0-d46b-482a-b0c5-493aeb506d61',
        '0x1361a7ba751256e9ac6b3e3e24912e50e68bef678c5132c11c95678220e3bf5e':
          '07b95f17-3f23-4a9e-8f43-33881273682c',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0x86a20051e6d1eecb0dd6e9c7b3b0cf946867e662b525ef2e9afe8428f6616ae0',
    },
    name: 'Not downloaded Email Credential',
    cTypeTitle: 'Email',
    attester: 'Trusted Entity attester',
    status: 'attested',
    isDownloaded: false,
  },
];

export const mockAttestations: {
  downloaded: IAttestation;
  notDownloaded: IAttestation;
} = {
  downloaded: {
    claimHash:
      '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae',
    cTypeHash:
      '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
    owner: 'did:kilt:light:004oUiK3EvTczc6ukYLEV57BuxzkW9zksKRchZXYGSocLmWE5N',
    delegationId: null,
    revoked: false,
  },
  notDownloaded: {
    claimHash:
      '0x86a20051e6d1eecb0dd6e9c7b3b0cf946867e662b525ef2e9afe8428f6616ae0',
    cTypeHash:
      '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
    owner: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
    delegationId: null,
    revoked: false,
  },
};

export const mockRequestCredential: ShareInput = {
  credentialRequest: {
    cTypes: [
      {
        cTypeHash: credentialsMock[0].credential.claim.cTypeHash,
        requiredProperties: ['Email'],
      },
    ],
    challenge: 'PASS',
  },
  verifierDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
  specVersion: '3.0',
};

export const mockUnknownCType = {
  ...mockRequestCredential,
  credentialRequest: {
    cTypes: [
      {
        cTypeHash: 'Some unknown cType',
      },
    ],
  },
};

export function CredentialsProviderMock({
  credentials = [...credentialsMock, ...notDownloaded],
  children,
}: {
  credentials?: SporranCredential[];
  children: JSX.Element;
}): JSX.Element {
  return (
    <CredentialsContext.Provider value={credentials}>
      {children}
    </CredentialsContext.Provider>
  );
}
