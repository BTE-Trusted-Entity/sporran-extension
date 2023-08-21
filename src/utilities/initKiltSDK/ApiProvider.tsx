import { Fragment, PropsWithChildren } from 'react';

import * as styles from './ApiProvider.module.css';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

import { initKiltSDK } from './initKiltSDK';

export function ApiProvider({ children }: PropsWithChildren) {
  const render = useAsyncValue(async () => {
    await initKiltSDK();
    return true;
  }, []);

  if (!render) {
    return <div className={styles.spinner} />;
  }

  return <Fragment>{children}</Fragment>;
}
