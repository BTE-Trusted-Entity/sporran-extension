import { Fragment, PropsWithChildren } from 'react';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

import { initKiltSDK } from './initKiltSDK';

export function ApiProvider({ children }: PropsWithChildren) {
  const render = useAsyncValue(async () => {
    await initKiltSDK();
    return true;
  }, []);

  if (!render) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
}
