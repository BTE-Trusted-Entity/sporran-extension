import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { jsonToBase64 } from '../base64/base64';

interface Props {
  path: string;
  data: unknown;
}

export function PopupTestProvider({
  path,
  data,
  children,
}: PropsWithChildren<Props>) {
  const serialized = jsonToBase64(data);
  return (
    <MemoryRouter initialEntries={[`${path}?data=${serialized}`]}>
      {children}
    </MemoryRouter>
  );
}
