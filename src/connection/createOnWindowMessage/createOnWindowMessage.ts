export function createOnWindowMessage<DataType>(type: string) {
  return function onWindowMessage(
    callback: (data: DataType) => void,
  ): () => void {
    function messageListener(message: MessageEvent) {
      const { data, source } = message;

      if (source === window && data.type === type) {
        callback(data.data);
      }
    }

    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  };
}
