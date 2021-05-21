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

  subscribe(input: Input, listener: (output: Output) => void): () => void {
    this.emitInput(input);

    const { output } = this;

    function responseListener({ source, data }: MessageEvent) {
      if (source === window && data.type === output) {
        listener(data.output);
      }
    }

    addListener(responseListener);

    return () => removeListener(responseListener);
  }

  async get(input: Input): Promise<Output> {
    let respond: (output: Output) => void;
    const result = new Promise<Output>((resolve) => {
      respond = resolve;
    });

    const unsubscribe = this.subscribe(input, (output) => {
      unsubscribe();
      respond(output);
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

  produce(producer: (input: Input) => Promise<Output>): () => void {
    const wrappedProducer = async ({ source, data }: MessageEvent) => {
      if (source === window && data.type === this.input) {
        const output = await producer(data.input);
        this.return(output);
      }
    };

    addListener(wrappedProducer);

    return () => removeListener(wrappedProducer);
  }

  publish(
    subscriber: (input: Input, publisher: (output: Output) => void) => void,
  ): () => void {
    const wrappedSubscriber = ({ source, data }: MessageEvent) => {
      if (source === window && data.type === this.input) {
        subscriber(data.input, this.return.bind(this));
      }
    };

    addListener(wrappedSubscriber);

    return () => removeListener(wrappedSubscriber);
  }

  forward(channel: { get: (input: Input) => Promise<Output> }): void {
    this.produce((input) => channel.get(input));
  }
}
