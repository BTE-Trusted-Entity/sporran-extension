import { Meta } from '@storybook/react';

import { SaveBackupPhrase } from './SaveBackupPhrase';

export default {
  title: 'Views/SaveBackupPhrase',
  component: SaveBackupPhrase,
} as Meta;

export function Template() {
  return (
    <SaveBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />
  );
}
