import { Fragment, ReactNode } from 'react';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

import { initKiltSDK } from './initKiltSDK';

export function ApiProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element | null {
  const render = useAsyncValue(async () => {
    await initKiltSDK();
    return true;
  }, []);

  if (!render) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
}
