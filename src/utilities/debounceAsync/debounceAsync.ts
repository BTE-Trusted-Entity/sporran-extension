import { makeControlledPromise } from '../makeControlledPromise/makeControlledPromise';
import { exceptionToError } from '../exceptionToError/exceptionToError';

interface Callable {
  // This is a case where we really do not care about args and return type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): Promise<any>;
}

export function debounceAsync<CallbackType extends Callable>(
  callback: CallbackType,
): CallbackType {
  const queue: (() => Promise<void>)[] = [];

  return async function debounced(...args) {
    const controlled = makeControlledPromise<ReturnType<CallbackType>>();

    queue.push(async () => {
      try {
        const result = await callback(...args);
        controlled.resolve(result);
      } catch (exception) {
        controlled.reject(exceptionToError(exception));
      }

      // remove self from the queue
      queue.shift();

      // run the next callback if present
      const nextCall = queue[0];
      if (nextCall) {
        nextCall();
      }
    });

    // only call self if there’s no one else to do it
    if (queue.length === 1) {
      const nextCall = queue[0];
      nextCall();
    }

    return controlled.promise;
  } as CallbackType;
}
