import { exceptionToError } from '../exceptionToError/exceptionToError';

interface ErrorJson {
  error: string;
  stack: string;
}

export function exceptionToJson(exception: unknown): ErrorJson {
  const instance = exceptionToError(exception);
  const error = instance.toString(); // some errors do not have `message`
  const { stack = '' } = instance;
  return { error, stack };
}

export function jsonToError(json: ErrorJson): Error {
  const error = new Error(json.error);
  error.stack = json.stack;
  return error;
}
