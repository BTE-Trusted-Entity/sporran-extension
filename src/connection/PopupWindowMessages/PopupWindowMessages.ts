import { PopupAction } from '../../utilities/popups/types';

const PopupWindowMessagesType = {
  request: 'sporranExtension.injectedScript.request',
  response: 'sporranExtension.injectedScript.response',
};

interface PopupWindowRequest {
  type: typeof PopupWindowMessagesType.request;
  action: PopupAction;
  data: {
    [key: string]: string;
  };
}

interface PopupWindowResponse {
  type: typeof PopupWindowMessagesType.response;
  data: {
    [key: string]: string;
  };
}

export function sendPopupWindowRequest(
  action: PopupAction,
  data: PopupWindowRequest['data'],
): void {
  window.postMessage(
    {
      type: PopupWindowMessagesType.request,
      action,
      ...data,
    } as PopupWindowRequest,
    window.location.href,
  );
}

export function sendPopupWindowResponse(
  data: PopupWindowResponse['data'],
): void {
  window.postMessage(
    {
      type: PopupWindowMessagesType.response,
      ...data,
    } as PopupWindowResponse,
    window.location.href,
  );
}

export function onPopupWindowRequest(
  callback: (action: PopupAction, data: PopupWindowRequest['data']) => void,
): () => void {
  function messageListener(message: MessageEvent) {
    const { data, source } = message;
    const { type, action, ...values } = data;

    if (source !== window || type !== PopupWindowMessagesType.request) {
      return;
    }

    callback(action, values);
  }

  window.addEventListener('message', messageListener);

  return () => window.removeEventListener('message', messageListener);
}

export function onPopupWindowResponse(
  callback: (data: PopupWindowResponse['data']) => void,
): () => void {
  function messageListener(message: MessageEvent) {
    const { data, source } = message;
    const { type, ...values } = data;

    if (source !== window || type !== PopupWindowMessagesType.response) {
      return;
    }

    callback(values);
  }

  window.addEventListener('message', messageListener);

  return () => window.removeEventListener('message', messageListener);
}
