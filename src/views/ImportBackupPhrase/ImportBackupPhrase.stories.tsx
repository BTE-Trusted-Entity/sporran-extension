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
  // backup phrase: century answer price repeat carpet truck swarm boost fine siege brain fog
  return (
    <ImportBackupPhrase
      onImport={action('onImport')}
      type="reset"
      address="4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos"
    />
  );
}
