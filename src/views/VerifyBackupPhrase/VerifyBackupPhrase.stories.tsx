import { Meta } from '@storybook/react';

import { VerifyBackupPhrase } from './VerifyBackupPhrase';

export default {
  title: 'Views/VerifyBackupPhrase',
  component: VerifyBackupPhrase,
} as Meta;

export function Template() {
  return (
    <VerifyBackupPhrase backupPhrase="one two two three four five six seven eight nine ten eleven" />
  );
}
