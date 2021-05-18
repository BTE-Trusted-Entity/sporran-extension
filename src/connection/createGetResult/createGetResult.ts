export function createGetResult<RequestType, ResponseType>(
  sendRequest: (request: RequestType) => void,
  onResponse: (callback: (response: ResponseType) => void) => () => void,
): (request: RequestType) => Promise<ResponseType> {
  return async function (request: RequestType) {
    sendRequest(request);

    return new Promise((resolve) => {
      const unsubscribe = onResponse((response) => {
        resolve(response);
        unsubscribe();
      });
    });
  };
}
