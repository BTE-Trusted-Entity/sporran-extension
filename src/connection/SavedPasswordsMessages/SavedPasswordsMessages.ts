import { browser } from 'webextension-polyfill-ts';

import { createOnMessage } from '../createOnMessage';

const SavedPasswordsMessagesType = {
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
  data: Record<string, never>;
}

interface ForgetPasswordRequest {
  type: typeof SavedPasswordsMessagesType.forgetPasswordRequest;
  data: {
    address: string;
  };
}

interface ForgetAllPasswordsRequest {
  type: typeof SavedPasswordsMessagesType.forgetAllPasswordsRequest;
  data: Record<string, never>;
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

export const onSavePasswordRequest = createOnMessage<SavePasswordRequest>(
  SavedPasswordsMessagesType.savePasswordRequest,
);

export async function savePasswordListener({
  address,
  password,
}: SavePasswordRequest['data']): Promise<void> {
  savedPasswords[address] = { password, timestamp: Date.now() };
}

export const onGetPasswordRequest = createOnMessage<
  GetPasswordRequest,
  string | undefined
>(SavedPasswordsMessagesType.getPasswordRequest);

export async function getPasswordListener({
  address,
}: GetPasswordRequest['data']): Promise<string | undefined> {
  return savedPasswords[address]?.password;
}

export const onForgetPasswordRequest = createOnMessage<ForgetPasswordRequest>(
  SavedPasswordsMessagesType.forgetPasswordRequest,
);

export async function forgetPasswordListener({
  address,
}: ForgetPasswordRequest['data']): Promise<void> {
  delete savedPasswords[address];
}

export const onForgetAllPasswordsRequest = createOnMessage<ForgetAllPasswordsRequest>(
  SavedPasswordsMessagesType.forgetAllPasswordsRequest,
);

export async function forgetAllPasswordsListener(): Promise<void> {
  for (const password in savedPasswords) {
    delete savedPasswords[password];
  }
}

export const onHasSavedPasswordsRequest = createOnMessage<
  HasSavedPasswordsRequest,
  boolean
>(SavedPasswordsMessagesType.hasSavedPasswordsRequest);

export async function hasSavedPasswordsListener(): Promise<boolean> {
  return Object.values(savedPasswords).length > 0;
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
