export * from '@testing-library/react';
export { waitForElementToBeRemoved } from '@testing-library/dom';
import { act, render as externalRender, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import dialogPolyfill from 'dialog-polyfill';

import { AccountsProviderMock } from './testing/AccountsProviderMock';

export {
  AccountsProviderMock,
  accountsMock,
} from './testing/AccountsProviderMock';

export { mockBackgroundScript } from './testing/mockBackgroundScript';

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
