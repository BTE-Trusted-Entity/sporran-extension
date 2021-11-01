import '@testing-library/jest-dom';
import { TextDecoder } from 'node:util';

// The cbor package (or its dependency) needs this to work, and it works in the browser,
// but not in the jest-provided jsdom environment
// https://github.com/hildjj/nofilter/issues/7
// https://github.com/jsdom/jsdom/issues/2524
if (!('TextDecoder' in global)) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}
