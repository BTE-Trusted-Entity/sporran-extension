import { MemoryRouter } from 'react-router-dom';
import { AnyJson } from '@polkadot/types/types';

import { jsonToBase64 } from './usePopupData';

interface Props {
  path: string;
  data?: AnyJson;
  children: JSX.Element;
}

export function PopupTestProvider({
  path,
  data,
  children,
}: Props): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${path}?data=${jsonToBase64(data)}`]}>
      {children}
    </MemoryRouter>
  );
}
