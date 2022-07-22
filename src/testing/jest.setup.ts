import '@testing-library/jest-dom';
import { TextDecoder } from 'node:util';

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

jest.mock('@kiltprotocol/core', () => ({
  Attestation: { query: jest.fn() },
}));
jest.mock('@kiltprotocol/did', () => ({
  Utils: { parseDidUri: jest.fn() },
  Chain: { queryDetails: jest.fn() },
}));
jest.mock('@kiltprotocol/utils', () => ({
  DataUtils: {
    validateAddress: jest.fn(),
  },
}));

jest.mock('../components/Avatar/Identicon', () => ({
  Identicon: () => 'Identicon',
}));

jest.mock('ky', () => ({}));
