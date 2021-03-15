import { render } from '../../testing';

import { VerifyBackupPhrase } from './VerifyBackupPhrase';

describe('VerifyBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(
      <VerifyBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />,
    );
    expect(container).toMatchSnapshot();
  });
});
