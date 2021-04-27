import { browser } from 'webextension-polyfill-ts';
import {
  SavePasswordRequest,
  MessageType,
  GetPasswordRequest,
  ForgetPasswordRequest,
  ForgetAllPasswordsRequest,
  HasSavedPasswordsRequest,
} from '../MessageType';

interface SavedPassword {
  password: string;
  timestamp: number;
}

const savedPasswords: Record<string, SavedPassword> = {};

const saveDuration = 15 * 60 * 1000;
const intervalDuration = 1 * 60 * 1000;

export function savePasswordListener(message: SavePasswordRequest): void {
  if (message.type !== MessageType.savePasswordRequest) {
    return;
  }
  const { password, address } = message.data;

  savedPasswords[address] = { password, timestamp: Date.now() };
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

export function hasSavedPasswordsListener(
  message: HasSavedPasswordsRequest,
): Promise<boolean> | void {
  if (message.type !== MessageType.hasSavedPasswordsRequest) {
    return;
  }
  const hasPasswords = Object.values(savedPasswords).length > 0;
  return Promise.resolve(hasPasswords);
}

function checkExpiredPasswords(): void {
  const oldestPossible = Date.now() - saveDuration;
  for (const password in savedPasswords) {
    const { timestamp } = savedPasswords[password];
    if (timestamp < oldestPossible) {
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
  browser.runtime.onMessage.addListener(hasSavedPasswordsListener);
}
