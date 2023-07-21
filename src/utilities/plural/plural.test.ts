import browser from 'webextension-polyfill';

import { plural } from './plural';

jest.mock('webextension-polyfill');
jest
  .spyOn(browser.i18n, 'getMessage')
  .mockImplementation((key) => (key === 'messages_locale' ? 'en' : key));

describe('plural', () => {
  it('should return proper form for one', async () => {
    const actual = plural(1, { one: 'PASS', other: 'FAIL' });
    expect(actual).toEqual('PASS');
  });
  it('should return proper form for other', async () => {
    const actual = plural(2, { one: 'FAIL', other: 'PASS' });
    expect(actual).toEqual('PASS');
  });
});
