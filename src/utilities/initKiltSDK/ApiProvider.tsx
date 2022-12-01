import * as styles from './ApiProvider.module.css';

import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

import { initKiltSDK } from './initKiltSDK';

export function ApiProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const render = useAsyncValue(async () => {
    await initKiltSDK();
    return true;
  }, []);

  return render ? children : <div className={styles.spinner} />;
}
