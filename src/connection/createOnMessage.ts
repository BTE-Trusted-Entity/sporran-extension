import { browser } from 'webextension-polyfill-ts';

interface BaseMessageType {
  type: string;
  data: { [key: string]: string };
}

type EventEmitter = typeof browser.runtime.onMessage;
type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

export function createOnMessage<
  MessageType extends BaseMessageType,
  ReturnValue = void
>(type: string, emitter: EventEmitter = browser.runtime.onMessage) {
  return function onMessage(
    callback: (
      data: MessageType['data'],
      sender: SenderType,
    ) => Promise<ReturnValue>,
  ): () => void {
    function messageListener(
      message: MessageType,
      sender: SenderType,
    ): Promise<ReturnValue> | void {
      if (message.type === type) {
        return callback(message.data as MessageType['data'], sender);
      }
    }

    emitter.addListener(messageListener);
    return () => emitter.removeListener(messageListener);
  };
}
