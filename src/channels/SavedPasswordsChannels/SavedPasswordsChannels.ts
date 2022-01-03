import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';

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
  channelsEnum.savePassword,
);

export async function savePassword({
  address,
  password,
}: SavePasswordInput): Promise<void> {
  savedPasswords[address] = { password, timestamp: Date.now() };
}

export const getPasswordChannel = new BrowserChannel<
  string,
  string | undefined
>(channelsEnum.getPassword);

export async function getPassword(
  address: string,
): Promise<string | undefined> {
  return savedPasswords[address]?.password;
}

export const forgetPasswordChannel = new BrowserChannel<string>(
  channelsEnum.forgetPassword,
);

export async function forgetPassword(address: string): Promise<void> {
  delete savedPasswords[address];
}

export const hasSavedPasswordsChannel = new BrowserChannel<void, boolean>(
  channelsEnum.hasSavedPasswords,
);

export async function hasSavedPasswords(): Promise<boolean> {
  return Object.values(savedPasswords).length > 0;
}

export const forgetAllPasswordsChannel = new BrowserChannel(
  channelsEnum.forgetAllPasswords,
);

export async function forgetAllPasswords(): Promise<void> {
  for (const password in savedPasswords) {
    delete savedPasswords[password];
  }
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
