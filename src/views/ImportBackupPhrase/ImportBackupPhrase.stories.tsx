import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ImportBackupPhrase } from './ImportBackupPhrase';

export default {
  title: 'Views/ImportBackupPhrase',
  component: ImportBackupPhrase,
} as Meta;

export function Import() {
  return <ImportBackupPhrase onImport={action('onImport')} />;
}

export function Reset() {
  // backup phrase: pool ahead ask clock then morning invest raise atom grace fly valve
  return (
    <ImportBackupPhrase
      onImport={action('onImport')}
      type="reset"
      address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1"
    />
  );
}
