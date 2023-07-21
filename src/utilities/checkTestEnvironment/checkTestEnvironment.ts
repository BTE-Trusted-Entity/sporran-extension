import browser from 'webextension-polyfill';

import { isInternal } from '../../configuration/variant';
import { storage } from '../storage/storage';

const storageKey = 'lastApprovalTimestamp';
const approvalLifetimeMs = 1000 * 60 * 60 * 24;

export async function checkTestEnvironment() {
  if (!isInternal) {
    return;
  }

  const stored = await storage.get(storageKey);
  const lastApprovalTimeStamp = stored ? stored[storageKey] : 0;
  if (Date.now() < lastApprovalTimeStamp + approvalLifetimeMs) {
    return;
  }

  const message =
    'This is a testing version, do not use it with real KILT coins or identities. Do you want to install the real Sporran?';

  if (!confirm(message)) {
    await storage.set({ [storageKey]: Date.now() });
    return;
  }

  await browser.tabs.create({ url: 'https://www.sporran.org' });
  window.close();
  throw new Error('The user does not want to use the testing version.');
}
