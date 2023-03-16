// We do want to override the `render` from testing-library
// eslint-disable-next-line import/export
export * from '@testing-library/react';

import { act, render as externalRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import dialogPolyfill from 'dialog-polyfill';
import { HTMLDialog } from 'react-dialog-polyfill';

import { ConfigurationProvider } from '../configuration/ConfigurationContext';
import { IdentitiesProviderMock } from '../utilities/identities/IdentitiesProvider.mock';
import { CredentialsProviderMock } from '../utilities/credentials/CredentialsProvider.mock';
import { mockIsFullDid } from '../utilities/did/did.mock';

export {
  IdentitiesProviderMock,
  identitiesMock,
  moreIdentitiesMock,
} from '../utilities/identities/IdentitiesProvider.mock';

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
  readonly prototype: HTMLDialog;
};

export function mockDialogShowModal(): void {
  HTMLDialogElement.prototype.showModal = jest.fn();
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
