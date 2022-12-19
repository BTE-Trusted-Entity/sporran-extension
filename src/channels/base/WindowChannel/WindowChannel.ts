import { makeControlledPromise } from '../../../utilities/makeControlledPromise/makeControlledPromise';
import {
  exceptionToJson,
  jsonToError,
} from '../../../utilities/exceptionToJson/exceptionToJson';
import { ErrorFirstCallback } from '../types';

function addListener(listener: (message: MessageEvent) => void) {
  window.addEventListener('message', listener);
}

function removeListener(listener: (message: MessageEvent) => void) {
  window.removeEventListener('message', listener);
}

export class WindowChannel<Input, Output> {
  input: string;
  output: string;

  constructor(type: string) {
    this.input = `anotherExtension.injectedScript.${type}Input`;
    this.output = `anotherExtension.injectedScript.${type}Output`;
  }

  emitInput(input: Input): string {
    const callId = String(Math.random());

    const message = {
      type: this.input,
      callId,
      input,
    };
    window.postMessage(message, window.location.href);

    return callId;
  }

  subscribe(input: Input, listener: ErrorFirstCallback<Output>): () => void {
    const callId = this.emitInput(input);

    const { output } = this;

    function responseListener({ source, data }: MessageEvent) {
      if (source === window && data.type === output && data.callId === callId) {
        if (data.error) {
          listener(jsonToError(data));
        } else {
          listener(null, data.output);
        }
      }
    }

    addListener(responseListener);

    return () => removeListener(responseListener);
  }

  async get(input: Input): Promise<Output> {
    const result = makeControlledPromise<Output>();
    const unsubscribe = this.subscribe(input, result.callback);
    return result.promise.finally(unsubscribe);
  }

  return(output: Output, callId: string): void {
    const message = {
      type: this.output,
      callId,
      output,
    };
    window.postMessage(message, window.location.href);
  }

  throw(error: string, stack: string, callId: string): void {
    const message = {
      type: this.output,
      callId,
      error,
      stack,
    };
    window.postMessage(message, window.location.href);
  }

  produce(producer: (input: Input) => Promise<Output>): () => void {
    const wrappedProducer = async ({ source, data }: MessageEvent) => {
      if (!(source === window && data.type === this.input)) {
        return;
      }
      try {
        const output = await producer(data.input);
        this.return(output, data.callId);
      } catch (exception) {
        const { error, stack } = exceptionToJson(exception);
        this.throw(error, stack, data.callId);
      }
    };

    addListener(wrappedProducer);

    return () => removeListener(wrappedProducer);
  }

  publish(
    subscriber: (input: Input, publisher: ErrorFirstCallback<Output>) => void,
  ): () => void {
    const wrappedSubscriber = ({ source, data }: MessageEvent) => {
      if (!(source === window && data.type === this.input)) {
        return;
      }
      subscriber(data.input, (error, output?) => {
        if (error) {
          const json = exceptionToJson(error);
          this.throw(json.error, json.stack, data.callId);
        } else {
          this.return(output as Output, data.callId);
        }
      });
    };

    addListener(wrappedSubscriber);

    return () => removeListener(wrappedSubscriber);
  }

  forward(channel: { get: (input: Input) => Promise<Output> }): () => void {
    return this.produce((input) => channel.get(input));
  }
}
