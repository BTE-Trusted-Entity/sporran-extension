import { useEffect, useState } from 'react';
import { storage } from '../storage/storage';

function toKey(hash: string): string {
  return `kilt:ctype:${hash}`;
}

export async function saveCTypeTitle(
  hash: string,
  title: string,
): Promise<void> {
  const key = toKey(hash);
  await storage.set({ [key]: title });
}

export async function getCTypeTitle(hash: string): Promise<string> {
  const key = toKey(hash);
  const title = (await storage.get(key))[key];
  if (!title) {
    throw new Error(`Unknown CType ${hash}`);
  }
  return title;
}

export function useCTypeTitle(hash: string): string | null {
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const savedTitle = await getCTypeTitle(hash);
      // ignore the unknown CType error
      setTitle(savedTitle);
    })();
  }, [hash]);

  return title;
}
