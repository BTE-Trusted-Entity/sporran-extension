import { useEffect, useState } from 'react';

import { exceptionToError } from '../exceptionToError/exceptionToError';

export function useAsyncValue<Input extends Array<unknown>, Output>(
  fetcher: (...args: Input) => Promise<Output>,
  args: Input,
): Output | undefined {
  const [data, setData] = useState<Output>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      try {
        setData(await fetcher(...args));
      } catch (exception) {
        console.error(exception);
        setError(exceptionToError(exception));
      }
    })();
  }, args); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    throw error;
  }

  return data;
}
