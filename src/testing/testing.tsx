// We do want to override the `render` from testing-library
// eslint-disable-next-line import/export
export * from '@testing-library/react';

import { act, render as externalRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import dialogPolyfill from 'dialog-polyfill';

import { ConfigurationProvider } from '../configuration/ConfigurationContext';
import { IdentitiesProviderMock } from '../utilities/identities/IdentitiesProvider.mock';
import { CredentialsProviderMock } from '../utilities/credentials/CredentialsProvider.mock';
import { mockBalanceChanges } from '../utilities/balanceChanges/mockBalanceChanges';
import { mockIsFullDid } from '../utilities/did/did.mock';

export {
  IdentitiesProviderMock,
  identitiesMock,
  moreIdentitiesMock,
} from '../utilities/identities/IdentitiesProvider.mock';

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
jest.mock('@kiltprotocol/core', () => ({}));
jest.mock('@kiltprotocol/did', () => ({}));

jest.mock('../components/Avatar/Identicon', () => ({
  Identicon: () => 'Identicon',
}));

mockBalanceChanges();
mockIsFullDid(false);

// We do want to override the `render` from testing-library
// eslint-disable-next-line import/export
export function render(
  ui: Parameters<typeof externalRender>[0],
  options?: Parameters<typeof externalRender>[1],
): ReturnType<typeof externalRender> {
  return externalRender(
    <ConfigurationProvider>
      <IdentitiesProviderMock>
        <CredentialsProviderMock>
          <MemoryRouter>{ui}</MemoryRouter>
        </CredentialsProviderMock>
      </IdentitiesProviderMock>
    </ConfigurationProvider>,
    options,
  );
}

const dialogPromise = Promise.resolve();
jest.mocked(dialogPolyfill.registerDialog).mockReturnValue(undefined);

export async function waitForDialogUpdate(): Promise<void> {
  await act(() => dialogPromise);
}

// this declaration is not present in the TS anymore (https://github.com/DefinitelyTyped/DefinitelyTyped/pull/54052)
// but for us the implementation is provided by the dialog-polyfill
declare const HTMLDialogElement: {
  new (): HTMLDialogElement;
  readonly prototype: HTMLDialogElement;
};

export function mockDialogShowModal(): void {
  (
    HTMLDialogElement.prototype as unknown as {
      showModal: () => void;
    }
  ).showModal = jest.fn();
}

/** Helps against the warning `Not implemented: HTMLFormElement.prototype.submit`
 * in JSDom: https://github.com/jsdom/jsdom/issues/1937 */
export async function runWithJSDOMErrorsDisabled(
  callback: () => void,
): Promise<void> {
  const console = (
    window as unknown as {
      _virtualConsole: { emit: () => void };
    }
  )._virtualConsole;

  const { emit } = console;
  console.emit = jest.fn();

  await callback();

  console.emit = emit;
}
