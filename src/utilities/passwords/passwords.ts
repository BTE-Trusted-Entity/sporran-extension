import { browser } from 'webextension-polyfill-ts';

import {
  MessageType,
  SavePasswordRequest,
  ForgetPasswordRequest,
  GetPasswordRequest,
} from '../../connection/MessageType';

export function savePassword(password: string, address: string): void {
  browser.runtime.sendMessage({
    type: MessageType.savePasswordRequest,
    data: {
      password,
      address,
    },
  } as SavePasswordRequest);
}

export async function getPassword(
  address: string,
): Promise<string | undefined> {
  return await browser.runtime.sendMessage({
    type: MessageType.getPasswordRequest,
    data: {
      address,
    },
  } as GetPasswordRequest);
}

export function forgetPassword(address: string): void {
  browser.runtime.sendMessage({
    type: MessageType.forgetPasswordRequest,
    data: {
      address,
    },
  } as ForgetPasswordRequest);
}

export function forgetAllPasswords(): void {
  browser.runtime.sendMessage({
    type: MessageType.forgetAllPasswordsRequest,
  });
}
