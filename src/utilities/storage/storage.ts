import { browser } from 'webextension-polyfill-ts';

export const storage = browser.storage.local;

export const storageAreaName = 'local';
