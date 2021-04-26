import { browser } from 'webextension-polyfill-ts';
import {
  SavePasswordRequest,
  MessageType,
  GetPasswordRequest,
  ForgetPasswordRequest,
  ForgetAllPasswordsRequest,
} from '../MessageType';

interface SavedPassword {
  password: string;
  timestamp: number;
}

const savedPasswords: Record<string, SavedPassword> = {};

const saveDuration = 15 * 60 * 1000; // milliseconds
const intervalDuration = 1 * 60 * 1000; // milliseconds

export function savePasswordListener(message: SavePasswordRequest): void {
  if (message.type !== MessageType.savePasswordRequest) {
    return;
  }
  const { password, address } = message.data;

  if (!savedPasswords[address]) {
    savedPasswords[address] = { password: '', timestamp: 0 };
  }
  savedPasswords[address].password = password;
  savedPasswords[address].timestamp = Date.now();
}

export function getPasswordListener(
  message: GetPasswordRequest,
): Promise<string | undefined> | void {
  if (message.type !== MessageType.getPasswordRequest) {
    return;
  }
  const { address } = message.data;
  return Promise.resolve(savedPasswords[address]?.password);
}

export function forgetPasswordListener(message: ForgetPasswordRequest): void {
  if (message.type !== MessageType.forgetPasswordRequest) {
    return;
  }
  const { address } = message.data;
  delete savedPasswords[address];
}

export function forgetAllPasswordsListener(
  message: ForgetAllPasswordsRequest,
): void {
  if (message.type !== MessageType.forgetAllPasswordsRequest) {
    return;
  }
  for (const password in savedPasswords) {
    delete savedPasswords[password];
  }
}

function checkExpiredPasswords(): void {
  for (const password in savedPasswords) {
    console.log('Checking password: ', savedPasswords[password].password);
    if (Date.now() - savedPasswords[password].timestamp > saveDuration) {
      delete savedPasswords[password];
    }
  }
}

export function initSavedPasswords(): void {
  setInterval(checkExpiredPasswords, intervalDuration);
  browser.runtime.onMessage.addListener(savePasswordListener);
  browser.runtime.onMessage.addListener(getPasswordListener);
  browser.runtime.onMessage.addListener(forgetPasswordListener);
  browser.runtime.onMessage.addListener(forgetAllPasswordsListener);
}
