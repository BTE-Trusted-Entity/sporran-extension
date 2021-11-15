import { MemoryRouter } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

import { jsonToBase64 } from './usePopupData';

interface Props {
  path: string;
  data?: unknown;
  children: JSX.Element;
}

export function PopupTestProvider({
  path,
  data,
  children,
}: Props): JSX.Element {
  const serialized = jsonToBase64(data as AnyJson);
  return (
    <MemoryRouter initialEntries={[`${path}?data=${serialized}`]}>
      {children}
    </MemoryRouter>
  );
}
