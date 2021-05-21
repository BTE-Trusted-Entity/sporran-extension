import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

interface SavedPassword {
  password: string;
  timestamp: number;
}

const savedPasswords: Record<string, SavedPassword> = {};

interface SavePasswordInput {
  password: string;
  address: string;
}

export const savePasswordChannel = new BrowserChannel<SavePasswordInput>(
  'savePassword',
);

export async function savePassword({
  address,
  password,
}: SavePasswordInput): Promise<void> {
  savedPasswords[address] = { password, timestamp: Date.now() };
}

export function initBackgroundSavePasswordChannel(): void {
  savePasswordChannel.produce(savePassword);
}

export const getPasswordChannel = new BrowserChannel<
  string,
  string | undefined
>('getPassword');

export async function getPassword(
  address: string,
): Promise<string | undefined> {
  return savedPasswords[address]?.password;
}

export function initBackgroundGetPasswordChannel(): void {
  getPasswordChannel.produce(getPassword);
}

export const forgetPasswordChannel = new BrowserChannel<string>(
  'forgetPassword',
);

export async function forgetPassword(address: string): Promise<void> {
  delete savedPasswords[address];
}

export function initBackgroundForgetPasswordChannel(): void {
  forgetPasswordChannel.produce(forgetPassword);
}

export const hasSavedPasswordsChannel = new BrowserChannel<void, boolean>(
  'hasSavedPasswords',
);

export async function hasSavedPasswords(): Promise<boolean> {
  return Object.values(savedPasswords).length > 0;
}

export function initBackgroundHasSavedPasswordsChannel(): void {
  hasSavedPasswordsChannel.produce(hasSavedPasswords);
}

export const forgetAllPasswordsChannel = new BrowserChannel(
  'forgetAllPasswords',
);

export async function forgetAllPasswords(): Promise<void> {
  for (const password in savedPasswords) {
    delete savedPasswords[password];
  }
}

export function initBackgroundForgetAllPasswordsChannel(): void {
  forgetAllPasswordsChannel.produce(forgetAllPasswords);
}

const saveDuration = 15 * 60 * 1000;
const intervalDuration = 1 * 60 * 1000;

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
