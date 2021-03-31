import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ImportBackupPhrase } from './ImportBackupPhrase';

export default {
  title: 'Views/ImportBackupPhrase',
  component: ImportBackupPhrase,
} as Meta;

export function Import(): JSX.Element {
  return <ImportBackupPhrase onImport={action('onImport')} />;
}

export function Reset(): JSX.Element {
  return <ImportBackupPhrase onImport={action('onImport')} type="reset" />;
}
