import { browser } from 'webextension-polyfill-ts';
import {
  SavePasswordRequest,
  MessageType,
  GetPasswordRequest,
  ForgetPasswordRequest,
  ForgetAllPasswordsRequest,
} from '../MessageType';

interface SavedPassword {
  password?: string;
  timestamp?: number;
}

const savedPasswords: Record<string, SavedPassword> = {};

let intervalId: NodeJS.Timeout;

const saveDuration = 15; // in minutes
const intervalDuration = 1; // in minutes

function cleanUp(): void {
  if (Object.values(savedPasswords).length === 0) {
    clearInterval(intervalId);
  }
}

function checkExpiredPasswords() {
  for (const password in savedPasswords) {
    if (
      Date.now() - savedPasswords[password].timestamp >
      saveDuration * 60000
    ) {
      delete savedPasswords[password];
    }
  }
  cleanUp();
}

export function savePasswordListener(message: SavePasswordRequest): void {
  if (message.type === MessageType.savePasswordRequest) {
    const { password, address } = message.data;
    if (Object.values(savedPasswords).length === 0) {
      intervalId = setInterval(function () {
        checkExpiredPasswords();
      }, intervalDuration * 60000);
    }
    if (!savedPasswords[address]) {
      savedPasswords[address] = {};
    }
    savedPasswords[address].password = password;
    savedPasswords[address].timestamp = Date.now();
  }
}

export function getPasswordListener(
  message: GetPasswordRequest,
): Promise<string> {
  if (message.type === MessageType.getPasswordRequest) {
    const { address } = message.data;
    return Promise.resolve(savedPasswords[address].password);
  }
}

export function forgetPasswordListener(message: ForgetPasswordRequest): void {
  if (message.type === MessageType.forgetPasswordRequest) {
    const { address } = message.data;
    delete savedPasswords[address];
    cleanUp();
  }
}

export function forgetAllPasswordsListener(
  message: ForgetAllPasswordsRequest,
): void {
  if (message.type === MessageType.forgetAllPasswordsRequest) {
    for (const password in savedPasswords) {
      delete savedPasswords[password];
    }
    cleanUp();
  }
}

export function initSavedPasswords(): void {
  browser.runtime.onMessage.addListener(savePasswordListener);
  browser.runtime.onMessage.addListener(getPasswordListener);
  browser.runtime.onMessage.addListener(forgetPasswordListener);
  browser.runtime.onMessage.addListener(forgetAllPasswordsListener);
}
