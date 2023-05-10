import { Meta } from '@storybook/react';
import { JSX } from 'react';
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
  // backup phrase: pool ahead ask clock then morning invest raise atom grace fly valve
  return (
    <ImportBackupPhrase
      onImport={action('onImport')}
      type="reset"
      address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1"
    />
  );
}
