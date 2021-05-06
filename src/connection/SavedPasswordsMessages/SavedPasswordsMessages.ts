import { browser } from 'webextension-polyfill-ts';

export const SavedPasswordsMessagesType = {
  savePasswordRequest: 'savePasswordRequest',
  getPasswordRequest: 'getPasswordRequest',
  hasSavedPasswordsRequest: 'hasSavedPasswordsRequest',
  forgetPasswordRequest: 'forgetPasswordRequest',
  forgetAllPasswordsRequest: 'forgetAllPasswordsRequest',
};

interface SavedPassword {
  password: string;
  timestamp: number;
}

export interface SavePasswordRequest {
  type: typeof SavedPasswordsMessagesType.savePasswordRequest;
  data: {
    password: string;
    address: string;
  };
}

export interface GetPasswordRequest {
  type: typeof SavedPasswordsMessagesType.getPasswordRequest;
  data: {
    address: string;
  };
}

export interface HasSavedPasswordsRequest {
  type: typeof SavedPasswordsMessagesType.hasSavedPasswordsRequest;
}

export interface ForgetPasswordRequest {
  type: typeof SavedPasswordsMessagesType.forgetPasswordRequest;
  data: {
    address: string;
  };
}

export interface ForgetAllPasswordsRequest {
  type: typeof SavedPasswordsMessagesType.forgetAllPasswordsRequest;
}

const savedPasswords: Record<string, SavedPassword> = {};

const saveDuration = 15 * 60 * 1000;
const intervalDuration = 1 * 60 * 1000;

export function savePasswordListener(message: SavePasswordRequest): void {
  if (message.type !== SavedPasswordsMessagesType.savePasswordRequest) {
    return;
  }
  const { password, address } = message.data;

  savedPasswords[address] = { password, timestamp: Date.now() };
}

export function getPasswordListener(
  message: GetPasswordRequest,
): Promise<string | undefined> | void {
  if (message.type !== SavedPasswordsMessagesType.getPasswordRequest) {
    return;
  }
  const { address } = message.data;
  return Promise.resolve(savedPasswords[address]?.password);
}

export function forgetPasswordListener(message: ForgetPasswordRequest): void {
  if (message.type !== SavedPasswordsMessagesType.forgetPasswordRequest) {
    return;
  }
  const { address } = message.data;
  delete savedPasswords[address];
}

export function forgetAllPasswordsListener(
  message: ForgetAllPasswordsRequest,
): void {
  if (message.type !== SavedPasswordsMessagesType.forgetAllPasswordsRequest) {
    return;
  }
  for (const password in savedPasswords) {
    delete savedPasswords[password];
  }
}

export function hasSavedPasswordsListener(
  message: HasSavedPasswordsRequest,
): Promise<boolean> | void {
  if (message.type !== SavedPasswordsMessagesType.hasSavedPasswordsRequest) {
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

export function schedulePasswordsCheck(): void {
  setInterval(checkExpiredPasswords, intervalDuration);
}

export function savePassword(password: string, address: string): void {
  browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.savePasswordRequest,
    data: {
      password,
      address,
    },
  });
}

export async function getPassword(
  address: string,
): Promise<string | undefined> {
  return browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.getPasswordRequest,
    data: {
      address,
    },
  });
}

export function forgetPassword(address: string): void {
  browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.forgetPasswordRequest,
    data: {
      address,
    },
  });
}

export function forgetAllPasswords(): void {
  browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.forgetAllPasswordsRequest,
  });
}

export async function hasSavedPasswords(): Promise<boolean> {
  return browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.hasSavedPasswordsRequest,
  });
}
