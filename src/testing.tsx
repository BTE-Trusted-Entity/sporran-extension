import { render as externalRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export function render(
  ui: Parameters<typeof externalRender>[0],
  options?: Parameters<typeof externalRender>[1],
): ReturnType<typeof externalRender> {
  return externalRender(<MemoryRouter>{ui}</MemoryRouter>, options);
}
