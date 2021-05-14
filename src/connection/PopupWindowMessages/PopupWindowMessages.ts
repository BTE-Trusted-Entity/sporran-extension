import { PopupAction } from '../../utilities/popups/types';

const request = 'sporranExtension.injectedScript.popupRequest';
const response = 'sporranExtension.injectedScript.popupResponse';

interface PopupWindowRequest {
  [key: string]: string;
}

interface PopupWindowResponse {
  [key: string]: string;
}

export function sendPopupWindowRequest(
  action: PopupAction,
  data: PopupWindowRequest,
): void {
  window.postMessage(
    {
      type: request,
      action,
      data,
    },
    window.location.href,
  );
}

export function sendPopupWindowResponse(data: PopupWindowResponse): void {
  window.postMessage(
    {
      type: response,
      data,
    },
    window.location.href,
  );
}

export function onPopupWindowRequest(
  callback: (action: PopupAction, data: PopupWindowRequest) => void,
): () => void {
  function messageListener(message: MessageEvent) {
    const { data, source } = message;

    if (source === window && data.type === request) {
      callback(data.action, data.data);
    }
  }

  window.addEventListener('message', messageListener);

  return () => window.removeEventListener('message', messageListener);
}

export function onPopupWindowResponse(
  callback: (data: PopupWindowResponse) => void,
): () => void {
  function messageListener(message: MessageEvent) {
    const { data, source } = message;

    if (source === window && data.type === response) {
      callback(data.data);
    }
  }

  window.addEventListener('message', messageListener);

  return () => window.removeEventListener('message', messageListener);
}
