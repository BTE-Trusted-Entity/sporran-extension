import { browser } from 'webextension-polyfill-ts';

type EventEmitter = typeof browser.runtime.onMessage;
export type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

export function createOnMessage<DataType, ReturnValue = void>(
  type: string,
  emitter: EventEmitter = browser.runtime.onMessage,
) {
  return function onMessage(
    callback: (data: DataType, sender: SenderType) => Promise<ReturnValue>,
  ): () => void {
    function messageListener(
      message: { type: string; data: DataType },
      sender: SenderType,
    ): Promise<ReturnValue> | void {
      if (message.type === type) {
        return callback(message.data as DataType, sender);
      }
    }

    emitter.addListener(messageListener);
    return () => emitter.removeListener(messageListener);
  };
}
