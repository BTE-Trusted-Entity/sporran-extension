import { IAttestation } from '@kiltprotocol/types';

import { ShareInput } from '../../channels/shareChannel/types';

import { Credential } from './credentials';
import { CredentialsContext } from './CredentialsContext';

export const credentialsMock: Credential[] = [
  {
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'mockEmail@mock.mock',
          Name: 'Mock Name',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'badboy69@hotmail.com',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'sporran@sporran.org',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'loremipsum@gmail.com',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'maxmustermann@gmx-123-z34-dfdsafsdf-42r421-2sdfag.de',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x47d04c42bdf7fdd3fc5a194bcaa367b2f4766a6b16ae3df628927656d818f420',
        contents: {
          Twitter: 'tweety_bird',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x47d04c42bdf7fdd3fc5a194bcaa367b2f4766a6b16ae3df628927656d818f420',
        contents: {
          Twitter: 'realDonaldTrump',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x55c1dd2f28ae7fc2376dda1c01bf94658fccd80d3fc6685b3a17427797e845a2',
        contents: {
          Name: 'God collator',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x55c1dd2f28ae7fc2376dda1c01bf94658fccd80d3fc6685b3a17427797e845a2',
        contents: {
          Name: 'This is a really long name for the first property of claim contents to check how the overflow looks',
        },
        owner:
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
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
          'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
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
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'sporran@sporran.org',
        },
        owner: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
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
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'mockEmail@mock.mock',
        },
        owner: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
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
    request: {
      claim: {
        cTypeHash:
          '0xad52bd7a8bd8a52e03181a99d2743e00d0a5e96fdc0182626655fcf0c0a776d0',
        contents: { Username: 'arty-name', 'User ID': '133055' },
        owner: 'did:kilt:4osWk37p2ut2QQpGgEumheYw9wgwSy4e9eoY9gESKqUwKFWi',
      },
      claimHashes: [
        '0xb04c4c8f3421f995e2afb7083ae0a28ca760eb20d520717e54100c7173c9cc9c',
        '0xc2261fea01b49101c4978636bad4b80fd3c686f9a83fe2a118252991098988b6',
        '0xd73bcd19fd7cf3516fb71ab27696c2d95881c990718c507e0f56cf273ef2392b',
      ],
      claimNonceMap: {
        '0x7ce01e912b0418e0634c95ff139cd10a98ad79aaa7c4a45d2aad93c33e694314':
          '104c3700-a835-4e4d-a2b9-ab6a2f015b94',
        '0xc9cccabfbfc0c529263c97d9775ed8297df7832d53948229c7282667c2d15f7c':
          'e07b01fd-5077-4f76-a6d9-ca00a3a8cb1b',
        '0x800e8346b87610819d18304201c9aaee24ef2f69769e86713928937e37ffff99':
          '4a63333e-7ec2-4262-80c8-c8e21e32abcc',
      },
      legitimations: [],
      delegationId: null,
      rootHash:
        '0x6e63a2a0d6926b8763cd19377922f9f381afc7fdf8c2794153912a46d7ffd3c0',
      claimerSignature: {
        signature:
          '0x4a73d9c90c57415a3a92c0fd1422d76ccf0ac95f3bc137c55f8c8019556a151befc3c0bd9c42adaeede6f31bffe9093e0f69507c55cffba113b0fe29cc30d989',
        keyId:
          'did:kilt:4osWk37p2ut2QQpGgEumheYw9wgwSy4e9eoY9gESKqUwKFWi#0xb7f88ab06c1aa772bd6ede14df99a2f05951d561530d88cef309cfed1bc8ad7b',
      },
    },
    name: 'GitHub 9',
    cTypeTitle: 'GitHub',
    attester: 'SocialKYC',
    status: 'attested',
    isDownloaded: true,
  },
];

export const notDownloaded: Credential[] = [
  {
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'mockEmail@mock.mock',
        },
        owner: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
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
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dao',
    },
    name: 'Email Credential',
    cTypeTitle: 'Email',
    attester: 'Trusted Entity attester',
    status: 'attested',
    isDownloaded: false,
  },
];

export const mockAttestation: IAttestation = {
  claimHash:
    '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae',
  cTypeHash:
    '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
  owner: 'did:kilt:light:004qe5tJgoBe2JJ7ejVVGBzkTxjjR4nPCGg7Q4nkZLqdHo7sPR',
  delegationId: null,
  revoked: false,
};

export const mockRequestCredential: ShareInput = {
  credentialRequest: {
    cTypes: [
      {
        cTypeHash: credentialsMock[0].request.claim.cTypeHash,
        requiredProperties: ['Email'],
      },
    ],
    challenge: 'PASS',
  },
  verifierDid: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
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
  credentials = credentialsMock,
  children,
}: {
  credentials?: Credential[];
  children: JSX.Element;
}): JSX.Element {
  return (
    <CredentialsContext.Provider value={credentials}>
      {children}
    </CredentialsContext.Provider>
  );
}
