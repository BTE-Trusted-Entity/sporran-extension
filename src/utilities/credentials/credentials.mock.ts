export const credentialsMock = [
  {
    request: {
      claim: {
        cTypeHash:
          '0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2',
        contents: {
          a: 'a',
          b: 'b',
          c: 'c',
        },
        owner: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
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
      legitimations: [
        {
          request: {
            claim: {
              cTypeHash:
                '0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2',
              contents: {},
              owner: '4siJtc4dYq2gPre8Xj6KJcSjVAdi1gmjctUzjf3AwrtNnhvy',
            },
            claimHashes: [
              '0xcadd6da3250ade3bfe5ee500397564bad781e76bb9b450c29b8a7adc31abf087',
            ],
            claimNonceMap: {
              '0xb1c5613aefedbebdb1a766a2541984bb8d8e8d337448e4b47eea0476c36a9cab':
                '0b5f09cd-ced2-41fb-9a73-5dffcc5096f4',
            },
            legitimations: [],
            delegationId: null,
            rootHash:
              '0xbf20af7b3c1131f3d06ed3635a5e966836917c5c67407e52709ce993556b2ad0',
            claimerSignature:
              '0x01f2d0f4a168e34af69c4d88b84b8295d2475d80520de13d29a947612376ca2e1bdc853203ce5baab8240239281d16d8174f2d86ff36efd5f1a03032e45b9a668c',
          },
          attestation: {
            claimHash:
              '0xbf20af7b3c1131f3d06ed3635a5e966836917c5c67407e52709ce993556b2ad0',
            cTypeHash:
              '0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2',
            delegationId: null,
            owner: '4r99cXtVR72nEr9d6o8NZGXmPKcpZ9NQ84LfgHuVssy91nKb',
            revoked: false,
          },
        },
      ],
      delegationId: null,
      rootHash:
        '0xbe7fcc7aa0186b05fd116c100e2d673fb951163693788640ce6032ad2f700dae',
      claimerSignature:
        '0x013cd4f4ef68539fa341a0054d55fa3813946d2963bca9e953ebbbd1e575aab26ee13bc0cde0a69588ce4e29b1f747b515c5bf1f4aa0c9bb49113a0fad7b68c38a',
    },
    name: 'My credential',
    cTypeTitle: 'CType-something',
    attester: 'Trusted Entity attester',
    isAttested: true,
  },
];

export const mockAttestation = {
  claimHash:
    '0xf53f460a9e96cf7ea3321ac001a89674850493e12fad28cbc868e026935436d2',
  cTypeHash:
    '0x240c744923bd98797504328f9bef57ca6c777f5cbf3e1aada74f348c9879d78a',
  owner: '4quK7LGg8iGqoH8kmeEeCDN7VM1aN5wmKkAfcH1VVU8tFmMc',
  delegationId: null,
  revoked: false,
};
