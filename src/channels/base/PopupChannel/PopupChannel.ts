import { PopupAction } from '../../../utilities/popups/types';
import {
  makeTransforms,
  Transforms,
} from '../ChannelTransforms/ChannelTransforms';
import { BrowserChannel } from '../BrowserChannel/BrowserChannel';
import { showPopup } from './PopupMessages';

interface Serializable {
  toString: () => string;
}

export class PopupChannel<
  Input = void,
  Output = void,
  JsonInput extends Record<string, Serializable> = Input extends Record<
    string,
    Serializable
  >
    ? Input
    : never,
  JsonOutput = Output,
> {
  action: PopupAction;
  channel: BrowserChannel<Input, Output, JsonInput, JsonOutput>;
  transform: Transforms<Input, Output, JsonInput, JsonOutput>;

  constructor(
    action: PopupAction,
    transform?: Partial<Transforms<Input, Output, JsonInput, JsonOutput>>,
  ) {
    this.action = action;
    this.channel = new BrowserChannel(`${action}Popup`, true, transform);
    this.transform = makeTransforms(transform);
  }

  async get(
    input: Input,
    sender: Parameters<typeof showPopup>[2],
  ): Promise<Output> {
    const jsonInput = this.transform.inputToJson(input);
    await showPopup(this.action, jsonInput, sender);

    return new Promise<Output>((resolve, reject) =>
      this.channel.listenForOutput((error, output?) => {
        if (error) {
          reject(error);
        } else {
          resolve(output as Output);
        }
      }),
    );
  }

  async return(output: Output): Promise<void> {
    return this.channel.return(output);
  }

  async throw(error: string): Promise<void> {
    return this.channel.throw(error);
  }
}
