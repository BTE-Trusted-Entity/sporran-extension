import { JSX } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { jsonToBase64 } from '../base64/base64';

interface Props {
  path: string;
  data: unknown;
  children: JSX.Element;
}

export function PopupTestProvider({
  path,
  data,
  children,
}: Props): JSX.Element {
  const serialized = jsonToBase64(data);
  return (
    <MemoryRouter initialEntries={[`${path}?data=${serialized}`]}>
      {children}
    </MemoryRouter>
  );
}
