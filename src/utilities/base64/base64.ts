import { AnyJson } from '@polkadot/types/types';
import { TextDecoder } from '@polkadot/x-textdecoder';
import { TextEncoder } from '@polkadot/x-textencoder';

export function stringToBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const asciiString = String.fromCodePoint(...bytes);
  return btoa(asciiString);
}

export function base64ToString(base64: string): string {
  const asciiString = atob(base64);
  const bytes = Uint8Array.from(asciiString, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function jsonToBase64(object: unknown): string {
  return stringToBase64(JSON.stringify(object));
}

export function base64ToJson(base64: string): AnyJson {
  return JSON.parse(base64ToString(base64));
}
