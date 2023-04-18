import { exceptionToError } from '../exceptionToError/exceptionToError';

interface ErrorJson {
  error: string;
  stack: string;
}

export function exceptionToJson(exception: unknown): ErrorJson {
  const instance = exceptionToError(exception);

  // some errors do not have `message`
  const stringified = instance.toString();
  // we don’t want to keep the generic 'Error: ' at the start of the string
  const error = stringified.replace(/^Error:\s+(.+)/, '$1');

  const { stack = '' } = instance;
  return { error, stack };
}

export function jsonToError(json: ErrorJson): Error {
  const error = new Error(json.error);
  error.stack = json.stack;
  return error;
}
