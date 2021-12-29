import { browser, Runtime } from 'webextension-polyfill-ts';

import { makeControlledPromise } from '../../../utilities/makeControlledPromise/makeControlledPromise';
import {
  makeTransforms,
  Transforms,
} from '../ChannelTransforms/ChannelTransforms';
import { exceptionToError } from '../../../utilities/exceptionToError/exceptionToError';
import { ErrorFirstCallback } from '../types';

interface ErrorMessage {
  error: string;
}

type MaybeSuccessMessage<JsonOutput> =
  | {
      type: string;
      callId: string;
      output: JsonOutput;
    }
  | {
      type: string;
      callId: string;
      error: string;
    };

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

  async emitInput(input: Input, callId: string): Promise<JsonOutput | void> {
    const message = {
      type: this.input,
      callId,
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

  listenForOutput(
    handleOutput: ErrorFirstCallback<Output>,
    callId: string,
  ): () => void {
    const responseListener = (message: MaybeSuccessMessage<JsonOutput>) => {
      if (message.type !== this.output || message.callId !== callId) {
        return;
      }
      if ('error' in message) {
        handleOutput(new Error(message.error));
        return;
      }
      try {
        const output = this.transform.jsonToOutput(message.output);
        handleOutput(null, output);
      } catch (exception) {
        handleOutput(exceptionToError(exception));
      }
    };

    this.emitter.addListener(responseListener);

    return () => this.emitter.removeListener(responseListener);
  }

  subscribe(
    input: Input,
    handleOutput: ErrorFirstCallback<Output>,
  ): () => void {
    const callId = String(Math.random());

    (async () => {
      try {
        await this.emitInput(input, callId);
      } catch (exception) {
        handleOutput(exceptionToError(exception));
      }
    })();

    return this.listenForOutput(handleOutput, callId);
  }

  async get(input: Input): Promise<Output> {
    if (!this.output) {
      const callId = String(Math.random());
      const jsonOutput = (await this.emitInput(input, callId)) as JsonOutput;
      return this.transform.jsonToOutput(jsonOutput);
    } else {
      const result = makeControlledPromise<Output>();
      const unsubscribe = this.subscribe(input, result.callback);
      return result.promise.finally(unsubscribe);
    }
  }

  produce(
    producer: (input: Input, sender: Runtime.MessageSender) => Promise<Output>,
  ): () => void {
    const wrappedProducer = (
      message: { type: string; input: JsonInput },
      sender: Runtime.MessageSender,
    ): Promise<JsonOutput | ErrorMessage> | void => {
      if (message.type !== this.input) {
        return;
      }
      return (async () => {
        try {
          const input = this.transform.jsonToInput(message.input);
          const output = await producer(input, sender);
          return this.transform.outputToJson(output);
        } catch (exception) {
          const error = exceptionToError(exception).message;
          return { error };
        }
      })();
    };

    this.emitter.addListener(wrappedProducer);

    return () => this.emitter.removeListener(wrappedProducer);
  }

  async return(output: Output, callId: string): Promise<void> {
    try {
      const jsonOutput = this.transform.outputToJson(output);
      await this.emit({
        type: this.output,
        callId,
        output: jsonOutput,
      });
    } catch (exception) {
      const error = exceptionToError(exception).message;
      await this.throw(error, callId);
    }
  }

  async throw(error: string, callId: string): Promise<void> {
    await this.emit({
      type: this.output,
      callId,
      error,
    });
  }

  publish(
    subscriber: (
      input: Input,
      publisher: ErrorFirstCallback<Output>,
      sender: Runtime.MessageSender,
    ) => void,
  ): () => void {
    const wrappedSubscriber = (
      message: {
        type: string;
        callId: string;
        input: JsonInput;
      },
      sender: Runtime.MessageSender,
    ) => {
      if (message.type !== this.input) {
        return;
      }
      const { callId } = message;
      const input = this.transform.jsonToInput(message.input);

      subscriber(
        input,
        async (error: Error | null, output?: Output) => {
          if (error) {
            await this.throw(error.toString(), callId);
            return;
          }
          try {
            await this.return(output as Output, callId);
          } catch (anotherError) {
            await this.throw(exceptionToError(anotherError).message, callId);
          }
        },
        sender,
      );
    };

    this.emitter.addListener(wrappedSubscriber);

    return () => this.emitter.removeListener(wrappedSubscriber);
  }

  forward(channel: { get: (input: Input) => Promise<Output> }): () => void;

  forward(channel: {
    get: (input: Input, sender: Runtime.MessageSender) => Promise<Output>;
  }): () => void;

  forward(channel: {
    get: (input: Input, sender?: Runtime.MessageSender) => Promise<Output>;
  }): () => void {
    return this.produce((input, sender) => channel.get(input, sender));
  }
}
