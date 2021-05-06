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

interface SavePasswordRequest {
  type: typeof SavedPasswordsMessagesType.savePasswordRequest;
  data: {
    password: string;
    address: string;
  };
}

interface GetPasswordRequest {
  type: typeof SavedPasswordsMessagesType.getPasswordRequest;
  data: {
    address: string;
  };
}

interface HasSavedPasswordsRequest {
  type: typeof SavedPasswordsMessagesType.hasSavedPasswordsRequest;
}

interface ForgetPasswordRequest {
  type: typeof SavedPasswordsMessagesType.forgetPasswordRequest;
  data: {
    address: string;
  };
}

interface ForgetAllPasswordsRequest {
  type: typeof SavedPasswordsMessagesType.forgetAllPasswordsRequest;
}

export function savePassword(password: string, address: string): void {
  browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.savePasswordRequest,
    data: {
      password,
      address,
    },
  } as SavePasswordRequest);
}

export async function getPassword(
  address: string,
): Promise<string | undefined> {
  return browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.getPasswordRequest,
    data: {
      address,
    },
  } as GetPasswordRequest);
}

export function forgetPassword(address: string): void {
  browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.forgetPasswordRequest,
    data: {
      address,
    },
  } as ForgetPasswordRequest);
}

export function forgetAllPasswords(): void {
  browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.forgetAllPasswordsRequest,
  } as ForgetAllPasswordsRequest);
}

export async function hasSavedPasswords(): Promise<boolean> {
  return browser.runtime.sendMessage({
    type: SavedPasswordsMessagesType.hasSavedPasswordsRequest,
  } as HasSavedPasswordsRequest);
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
