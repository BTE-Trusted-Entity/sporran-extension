import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

import { initKiltSDK } from './initKiltSDK';

export function ApiProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element | null {
  const render = useAsyncValue(async () => {
    await initKiltSDK();
    return true;
  }, []);

  return render ? children : null;
}
