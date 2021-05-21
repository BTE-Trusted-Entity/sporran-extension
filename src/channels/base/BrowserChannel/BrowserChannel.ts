import { browser } from 'webextension-polyfill-ts';
import {
  makeTransforms,
  Transforms,
} from '../ChannelTransforms/ChannelTransforms';

type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

export class BrowserChannel<
  Input = void,
  Output = void,
  JsonInput = Input,
  JsonOutput = Output,
> {
  emitter = browser.runtime.onMessage;
  emit = browser.runtime.sendMessage;
  input: string;
  output?: string;
  transform: Transforms<Input, Output, JsonInput, JsonOutput>;

  constructor(
    type: string,
    output = false,
    transform?: Partial<Transforms<Input, Output, JsonInput, JsonOutput>>,
  ) {
    this.input = `${type}Input`;
    this.output = output ? `${type}Output` : undefined;
    this.transform = makeTransforms(transform);
  }

  async emitInput(
    input: Input,
  ): ReturnType<typeof browser.runtime.sendMessage> {
    return this.emit({
      type: this.input,
      input: this.transform.inputToJson(input),
    });
  }

  listenForOutput(handleOutput: (output: Output) => void): () => void {
    const responseListener = (message: {
      type: string;
      output: JsonOutput;
    }) => {
      if (message.type === this.output) {
        const output = this.transform.jsonToOutput(message.output);
        handleOutput(output);
      }
    };

    this.emitter.addListener(responseListener);

    return () => this.emitter.removeListener(responseListener);
  }

  subscribe(input: Input, handleOutput: (output: Output) => void): () => void {
    this.emitInput(input);

    return this.listenForOutput(handleOutput);
  }

  async get(input: Input): Promise<Output> {
    if (!this.output) {
      const jsonOutput = await this.emitInput(input);
      return this.transform.jsonToOutput(jsonOutput);
    } else {
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
  }

  produce(
    producer: (input: Input, sender: SenderType) => Promise<Output>,
  ): () => void {
    const wrappedProducer = (
      message: { type: string; input: JsonInput },
      sender: SenderType,
    ) => {
      if (message.type === this.input) {
        return (async () => {
          const input = this.transform.jsonToInput(message.input);
          return producer(input, sender);
        })();
      }
    };

    this.emitter.addListener(wrappedProducer);

    return () => this.emitter.removeListener(wrappedProducer);
  }

  async return(output: Output): Promise<void> {
    return this.emit({
      type: this.output,
      output: this.transform.outputToJson(output),
    });
  }

  publish(
    subscriber: (
      input: Input,
      publisher: (output: Output) => void,
      sender: SenderType,
    ) => void,
  ): () => void {
    const wrappedSubscriber = (
      message: { type: string; input: JsonInput },
      sender: SenderType,
    ) => {
      if (message.type === this.input) {
        const input = this.transform.jsonToInput(message.input);
        subscriber(input, this.return.bind(this), sender);
      }
    };

    this.emitter.addListener(wrappedSubscriber);

    return () => this.emitter.removeListener(wrappedSubscriber);
  }

  forward(channel: { get: (input: Input) => Promise<Output> }): () => void;

  forward(channel: {
    get: (input: Input, sender: SenderType) => Promise<Output>;
  }): () => void;

  forward(channel: {
    get: (input: Input, sender?: SenderType) => Promise<Output>;
  }): () => void {
    return this.produce((input, sender) => channel.get(input, sender));
  }
}
