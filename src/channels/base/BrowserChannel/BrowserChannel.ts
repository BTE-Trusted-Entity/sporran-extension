import { browser } from 'webextension-polyfill-ts';
import { makeControlledPromise } from '../../../utilities/makeControlledPromise/makeControlledPromise';
import {
  makeTransforms,
  Transforms,
} from '../ChannelTransforms/ChannelTransforms';
import { ErrorFirstCallback } from '../types';

interface ErrorMessage {
  error: string;
}

type MaybeSuccessMessage<JsonOutput> =
  | {
      type: string;
      output: JsonOutput;
    }
  | {
      type: string;
      error: string;
    };

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

  async emitInput(input: Input): Promise<JsonOutput | void> {
    const message = {
      type: this.input,
      input: this.transform.inputToJson(input),
    };
    const result = (await this.emit(message)) as
      | JsonOutput
      | ErrorMessage
      | void;

    if (result && typeof result === 'object' && 'error' in result) {
      throw new Error(result.error);
    }

    return result;
  }

  listenForOutput(handleOutput: ErrorFirstCallback<Output>): () => void {
    const responseListener = (message: MaybeSuccessMessage<JsonOutput>) => {
      if (message.type !== this.output) {
        return;
      }
      if ('error' in message) {
        handleOutput(new Error(message.error));
        return;
      }
      try {
        const output = this.transform.jsonToOutput(message.output);
        handleOutput(null, output);
      } catch (error) {
        handleOutput(error);
      }
    };

    this.emitter.addListener(responseListener);

    return () => this.emitter.removeListener(responseListener);
  }

  subscribe(
    input: Input,
    handleOutput: ErrorFirstCallback<Output>,
  ): () => void {
    (async () => {
      try {
        await this.emitInput(input);
      } catch (error) {
        handleOutput(error);
      }
    })();

    return this.listenForOutput(handleOutput);
  }

  async get(input: Input): Promise<Output> {
    if (!this.output) {
      const jsonOutput = (await this.emitInput(input)) as JsonOutput;
      return this.transform.jsonToOutput(jsonOutput);
    } else {
      const result = makeControlledPromise<Output>();
      const unsubscribe = this.subscribe(input, result.callback);
      return result.promise.finally(unsubscribe);
    }
  }

  produce(
    producer: (input: Input, sender: SenderType) => Promise<Output>,
  ): () => void {
    const wrappedProducer = (
      message: { type: string; input: JsonInput },
      sender: SenderType,
    ): Promise<JsonOutput | ErrorMessage> | void => {
      if (message.type !== this.input) {
        return;
      }
      return (async () => {
        try {
          const input = this.transform.jsonToInput(message.input);
          const output = await producer(input, sender);
          return this.transform.outputToJson(output);
        } catch (error) {
          return { error: error.message };
        }
      })();
    };

    this.emitter.addListener(wrappedProducer);

    return () => this.emitter.removeListener(wrappedProducer);
  }

  async return(output: Output): Promise<void> {
    try {
      const jsonOutput = this.transform.outputToJson(output);
      await this.emit({
        type: this.output,
        output: jsonOutput,
      });
    } catch (error) {
      await this.throw(error.message);
    }
  }

  async throw(error: string): Promise<void> {
    await this.emit({
      type: this.output,
      error,
    });
  }

  publish(
    subscriber: (
      input: Input,
      publisher: ErrorFirstCallback<Output>,
      sender: SenderType,
    ) => void,
  ): () => void {
    const publisher = async (error: Error | null, output?: Output) => {
      if (error) {
        await this.throw(error.toString());
        return;
      }
      try {
        await this.return(output as Output);
      } catch (anotherError) {
        await this.throw(anotherError.toString());
      }
    };

    const wrappedSubscriber = (
      message: { type: string; input: JsonInput },
      sender: SenderType,
    ) => {
      if (message.type !== this.input) {
        return;
      }
      const input = this.transform.jsonToInput(message.input);
      subscriber(input, publisher, sender);
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
