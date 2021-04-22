import { browser } from 'webextension-polyfill-ts';
import { SavePasswordRequest, MessageType } from '../MessageType';

interface SavedPassword {
  password: string;
  timeout: NodeJS.Timeout;
}

const savedPasswords: Record<string, SavedPassword> = {};

export function savePasswordListener(message: SavePasswordRequest): void {
  if (message.type === MessageType.savePasswordRequest) {
    const { password, address } = message.data;
    // cancel previous timeout if there is already a password saved
    if (savedPasswords[address]) {
      clearTimeout(savedPasswords[address].timeout);
    }
    savedPasswords[address].password = password;
    savedPasswords[address].timeout = setTimeout(function () {
      delete savedPasswords[address];
    }, 900000);
  }
}

export function initSavePassword(): void {
  browser.runtime.onMessage.addListener(savePasswordListener);
}
