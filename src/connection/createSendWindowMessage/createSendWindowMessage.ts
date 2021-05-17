export function createSendWindowMessage<DataType>(type: string) {
  return function sendWindowMessage(data: DataType): void {
    window.postMessage({ type, data }, window.location.href);
  };
}
