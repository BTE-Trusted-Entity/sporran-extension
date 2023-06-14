import { ReactNode } from 'react';
import browser from 'webextension-polyfill';

export interface Value {
  value: ReactNode;
  label: string;
  details?: string;
}

export function getExtrinsicCallEntry({
  section,
  method,
  args,
}: {
  section: string;
  method: string;
  args: Record<string, unknown>;
}): Value {
  const t = browser.i18n.getMessage;

  const argsString = Object.keys(args).join(', ');
  const value = `${section}.${method}(${argsString})`;

  const details = JSON.stringify(args, undefined, 2);

  return {
    label: t('component_extrinsicDetails_method'),
    value,
    details,
  };
}

export function getExtrinsicDocsEntry({
  docs,
}: {
  docs?: { toString: () => string }[];
}): Value[] {
  const t = browser.i18n.getMessage;

  if (!docs) {
    return [];
  }
  const [value, ...rest] = docs;
  return [
    {
      label: t('component_extrinsicDetails_info'),
      value: value?.toString(),
      details: rest?.join('\n').replace(/\n+#.*$/s, ''),
    },
  ];
}
