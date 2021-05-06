import { browser } from 'webextension-polyfill-ts';

import { createOnMessage } from '../createOnMessage';

const savePasswordRequest = 'savePasswordRequest';
const getPasswordRequest = 'getPasswordRequest';
const hasSavedPasswordsRequest = 'hasSavedPasswordsRequest';
const forgetPasswordRequest = 'forgetPasswordRequest';
const forgetAllPasswordsRequest = 'forgetAllPasswordsRequest';

interface SavedPassword {
  password: string;
  timestamp: number;
}

interface SavePasswordRequest {
  password: string;
  address: string;
}

interface GetPasswordRequest {
  address: string;
}

type HasSavedPasswordsRequest = Record<string, never>;

interface ForgetPasswordRequest {
  address: string;
}

type ForgetAllPasswordsRequest = Record<string, never>;

export function savePassword(password: string, address: string): void {
  browser.runtime.sendMessage({
    type: savePasswordRequest,
    data: {
      password,
      address,
    } as SavePasswordRequest,
  });
}

export async function getPassword(
  address: string,
): Promise<string | undefined> {
  return browser.runtime.sendMessage({
    type: getPasswordRequest,
    data: {
      address,
    } as GetPasswordRequest,
  });
}

export function forgetPassword(address: string): void {
  browser.runtime.sendMessage({
    type: forgetPasswordRequest,
    data: {
      address,
    } as ForgetPasswordRequest,
  });
}

export function forgetAllPasswords(): void {
  browser.runtime.sendMessage({
    type: forgetAllPasswordsRequest,
  });
}

export async function hasSavedPasswords(): Promise<boolean> {
  return browser.runtime.sendMessage({
    type: hasSavedPasswordsRequest,
  });
}

const savedPasswords: Record<string, SavedPassword> = {};

const saveDuration = 15 * 60 * 1000;
const intervalDuration = 1 * 60 * 1000;

export const onSavePasswordRequest = createOnMessage<SavePasswordRequest>(
  savePasswordRequest,
);

export async function savePasswordListener({
  address,
  password,
}: SavePasswordRequest): Promise<void> {
  savedPasswords[address] = { password, timestamp: Date.now() };
}

export const onGetPasswordRequest = createOnMessage<
  GetPasswordRequest,
  string | undefined
>(getPasswordRequest);

export async function getPasswordListener({
  address,
}: GetPasswordRequest): Promise<string | undefined> {
  return savedPasswords[address]?.password;
}

export const onForgetPasswordRequest = createOnMessage<ForgetPasswordRequest>(
  forgetPasswordRequest,
);

export async function forgetPasswordListener({
  address,
}: ForgetPasswordRequest): Promise<void> {
  delete savedPasswords[address];
}

export const onForgetAllPasswordsRequest = createOnMessage<ForgetAllPasswordsRequest>(
  forgetAllPasswordsRequest,
);

export async function forgetAllPasswordsListener(): Promise<void> {
  for (const password in savedPasswords) {
    delete savedPasswords[password];
  }
}

export const onHasSavedPasswordsRequest = createOnMessage<
  HasSavedPasswordsRequest,
  boolean
>(hasSavedPasswordsRequest);

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
