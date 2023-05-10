import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { SaveBackupPhrase } from './SaveBackupPhrase';

export default {
  title: 'Views/SaveBackupPhrase',
  component: SaveBackupPhrase,
} as Meta;

export function Template(): JSX.Element {
  return (
    <SaveBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />
  );
}
