import '@testing-library/jest-dom';
import { TextDecoder } from 'node:util';

import BN from 'bn.js';

// The cbor package (or its dependency) needs this to work, and it works in the browser,
// but not in the jest-provided jsdom environment
// https://github.com/hildjj/nofilter/issues/7
// https://github.com/jsdom/jsdom/issues/2524
if (!('TextDecoder' in global)) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

// Mock most of polkadot code to optimize tests.
// Cannot be mocked: x-bigint, x-textdecoder, x-textencoder.
jest.mock('@polkadot/api-augment', () => ({}));
jest.mock('@polkadot/api-base', () => ({}));
jest.mock('@polkadot/api-derive', () => ({}));
jest.mock('@polkadot/api', () => ({}));
jest.mock('@polkadot/extension-inject', () => ({}));
jest.mock('@polkadot/keyring', () => ({}));
jest.mock('@polkadot/networks', () => ({}));
jest.mock('@polkadot/rpc-augment', () => ({}));
jest.mock('@polkadot/rpc-core', () => ({}));
jest.mock('@polkadot/rpc-provider', () => ({}));
jest.mock('@polkadot/types-augment', () => ({}));
jest.mock('@polkadot/types-codec', () => ({}));
jest.mock('@polkadot/types-create', () => ({}));
jest.mock('@polkadot/types-known', () => ({}));
jest.mock('@polkadot/types-support', () => ({}));
jest.mock('@polkadot/types', () => ({}));
jest.mock('@polkadot/ui-shared', () => ({}));
jest.mock('@polkadot/util-crypto', () => ({}));
jest.mock('@polkadot/util');
jest.mock('@polkadot/wasm-crypto-asmjs', () => ({}));
jest.mock('@polkadot/wasm-crypto-wasm', () => ({}));
jest.mock('@polkadot/wasm-crypto', () => ({}));
jest.mock('@polkadot/x-global', () => ({
  xglobal: {},
  extractGlobal: (name: string, fallback: string) =>
    (globalThis as unknown as Record<string, string>)[name] || fallback,
}));
jest.mock('@polkadot/x-fetch', () => ({}));
jest.mock('@polkadot/x-randomvalues', () => ({}));
jest.mock('@polkadot/x-ws', () => ({}));

jest.mock('@kiltprotocol/sdk-js', () => ({
  ConfigService: {
    api: undefined,
    get() {
      return this.api;
    },
    set({ api }: { api: undefined }) {
      this.api = api;
    },
  },
}));

jest.mock('@kiltprotocol/credentials', () => ({
  CType: { hashToId: jest.fn() },
}));

jest.mock('@kiltprotocol/chain-helpers', () => ({
  BalanceUtils: {
    toFemtoKilt(coins: number) {
      const string = coins.toString().includes('e')
        ? coins.toFixed(15)
        : coins.toString();
      const digits = [...string, ...new Array(15).fill(0)];
      const index = digits.indexOf('.');
      if (index === -1) {
        return new BN(digits.join(''));
      }
      digits.splice(index, 1);
      return new BN(digits.slice(0, index + 15).join(''));
    },
  },
  Blockchain: { submitSignedTx: jest.fn() },
}));

jest.mock('@kiltprotocol/did', () => ({
  isSameSubject: jest.fn().mockReturnValue(true),
  serviceToChain: jest
    .fn()
    .mockImplementation(({ id, type, serviceEndpoint }) => ({
      id: id.substring(1),
      serviceTypes: type,
      urls: serviceEndpoint,
    })),
}));

jest.mock('@kiltprotocol/utils', () => ({
  DataUtils: {
    isKiltAddress: jest.fn(),
  },
  Crypto: {
    makeKeypairFromSeed: jest.fn(),
    makeKeypairFromUri: jest.fn(),
    encodeAddress: (address: string) => address,
  },
  Signers: {
    select: {
      bySignerId: jest.fn(),
      byAlgorithm: jest.fn(),
      byDid: jest.fn(),
      verifiableOnChain: jest.fn(),
    },
  },
}));

jest.mock('../components/Avatar/Identicon', () => ({
  Identicon: () => 'Identicon',
}));

jest.mock('ky', () => ({}));
