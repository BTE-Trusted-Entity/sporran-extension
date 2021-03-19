import { render } from '../../testing';

import { VerifyBackupPhrase } from './VerifyBackupPhrase';

jest.spyOn(Math, 'random').mockImplementation(() => 0.123456789);

describe('VerifyBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(
      <VerifyBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />,
    );
    expect(container).toMatchSnapshot();
  });
});
