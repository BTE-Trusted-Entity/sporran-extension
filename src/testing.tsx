export * from '@testing-library/react';
import { render as externalRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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
