import { render } from '../../testing';

import * as VerifyBackupPhrase from './VerifyBackupPhrase';

// jest.mock('./VerifyBackupPhrase');
// (shuffle as jest.Mock).mockImplementation(() => [
//   'twelve, eleven, ten, nine, eight, seven, six, five, four, three, two, one',
// ]);

jest
  .spyOn(VerifyBackupPhrase, 'shuffle')
  .mockImplementation(() => [
    'eleven, twelve, ten, nine, eight, seven, six, five, one, three, two, four',
  ]);

describe('VerifyBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(
      <VerifyBackupPhrase.VerifyBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />,
    );
    expect(container).toMatchSnapshot();
  });
});
