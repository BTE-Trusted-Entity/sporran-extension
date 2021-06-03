interface Callable {
  // This is a case where we really do not care about args and return type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): Promise<any>;
}

export function debounceAsync<CallbackType extends Callable>(
  callback: CallbackType,
): CallbackType {
  let currentCall: Promise<ReturnType<CallbackType>> | undefined;

  return async function debounced(...args) {
    if (!currentCall) {
      currentCall = callback(...args);
    }

    try {
      return await currentCall;
    } finally {
      currentCall = undefined;
    }
  } as CallbackType;
}
