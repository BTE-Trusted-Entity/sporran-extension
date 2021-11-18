import { IAttestation } from '@kiltprotocol/types';
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
        },
        owner:
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
  },
  {
    request: {
      claim: {
        cTypeHash:
          '0x3291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac',
        contents: {
          Email: 'maxmustermann@gmx.de',
        },
        owner:
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
          'did:kilt:light:004rrkiRTZgsgxjJDFkLsivqqKTqdUTuxKk3FX3mKFAeMxsR51',
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
  },
];

export const mockAttestation: IAttestation = {
  claimHash:
    '0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2',
  cTypeHash:
    '0x240c744923bd98797504328f9bef57ca6c777f5cbf3e1aada74f348c9879d78a',
  owner: '4quK7LGg8iGqoH8kmeEeCDN7VM1aN5wmKkAfcH1VVU8tFmMc',
  delegationId: null,
  revoked: false,
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
