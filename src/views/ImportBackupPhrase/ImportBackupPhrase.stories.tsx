import { Meta } from '@storybook/react';
import { ImportBackupPhrase } from './ImportBackupPhrase';

export default {
  title: 'Views/ImportBackupPhrase',
  component: ImportBackupPhrase,
} as Meta;

export function Template(): JSX.Element {
  return <ImportBackupPhrase onImport={(val) => val} />;
}
