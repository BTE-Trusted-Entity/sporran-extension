import browser from 'webextension-polyfill';

type Category = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

type Keys = {
  [category in Category]?: string;
};

export function plural(value: number, keys: Keys): string {
  const locale = browser.i18n.getMessage('messages_locale');
  const category = new Intl.PluralRules(locale).select(value);

  const key = keys[category];
  if (!key) {
    const json = JSON.stringify(keys);
    throw new Error(
      `The category ${category} is not present in translation keys ${json}`,
    );
  }

  return browser.i18n.getMessage(key, [String(value)]);
}
