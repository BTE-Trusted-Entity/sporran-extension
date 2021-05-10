export * from '@testing-library/react';
export { waitForElementToBeRemoved } from '@testing-library/dom';
import { act, render as externalRender, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import dialogPolyfill from 'dialog-polyfill';

import { AccountsProviderMock } from '../utilities/accounts/AccountsProvider.mock';
import { Identicon } from '../components/Avatar/Identicon';

export {
  AccountsProviderMock,
  accountsMock,
  moreAccountsMock,
} from '../utilities/accounts/AccountsProvider.mock';

export { mockBackgroundScript } from './mockBackgroundScript';

jest.mock('../components/Avatar/Identicon');
(Identicon as jest.Mock).mockImplementation(() => 'Identicon');

export function render(
  ui: Parameters<typeof externalRender>[0],
  options?: Parameters<typeof externalRender>[1],
): ReturnType<typeof externalRender> {
  return externalRender(
    <AccountsProviderMock>
      <MemoryRouter>{ui}</MemoryRouter>
    </AccountsProviderMock>,
    options,
  );
}

export async function waitForTooltipUpdate(): Promise<void> {
  expect(await screen.findByRole('status')).toHaveAttribute(
    'data-popper-escaped',
  );
}

const dialogPromise = Promise.resolve();
(dialogPolyfill.registerDialog as jest.Mock).mockReturnValue(dialogPromise);

export async function waitForDialogUpdate(): Promise<void> {
  await act(() => dialogPromise);
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
