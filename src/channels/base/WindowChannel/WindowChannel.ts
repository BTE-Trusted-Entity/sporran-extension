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
    this.input = `sporranExtension.injectedScript.${type}Input`;
    this.output = `sporranExtension.injectedScript.${type}Output`;
  }

  emitInput(input: Input): void {
    const message = {
      type: this.input,
      input,
    };
    window.postMessage(message, window.location.href);
  }

  subscribe(input: Input, listener: ErrorFirstCallback<Output>): () => void {
    this.emitInput(input);

    const { output } = this;

    function responseListener({ source, data }: MessageEvent) {
      if (source === window && data.type === output) {
        if (data.error) {
          listener(new Error(data.error));
        } else {
          listener(null, data.output);
        }
      }
    }

    addListener(responseListener);

    return () => removeListener(responseListener);
  }

  async get(input: Input): Promise<Output> {
    let resolve: (output: Output) => void;
    let reject: (error: Error) => void;
    const result = new Promise<Output>((resolveArg, rejectArg) => {
      resolve = resolveArg;
      reject = rejectArg;
    });

    const unsubscribe = this.subscribe(input, (error, output?) => {
      if (error) {
        reject(error);
        return;
      }
      unsubscribe();
      resolve(output as Output);
    });

    return result;
  }

  return(output: Output): void {
    const message = {
      type: this.output,
      output,
    };
    window.postMessage(message, window.location.href);
  }

  throw(error: string): void {
    const message = {
      type: this.output,
      error,
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
        this.return(output);
      } catch (error) {
        this.throw(error.message);
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
          this.throw(error.message);
        } else {
          this.return(output as Output);
        }
      });
    };

    addListener(wrappedSubscriber);

    return () => removeListener(wrappedSubscriber);
  }

  forward(channel: { get: (input: Input) => Promise<Output> }): void {
    this.produce((input) => channel.get(input));
  }
}
