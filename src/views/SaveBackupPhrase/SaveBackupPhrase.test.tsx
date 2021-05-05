import { render } from '../../testing/testing';

import { SaveBackupPhrase } from './SaveBackupPhrase';

describe('SaveBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(
      <SaveBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />,
    );
    expect(container).toMatchSnapshot();
  });
});
