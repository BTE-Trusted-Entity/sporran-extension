import { render } from '../../testing';

import { VerifyBackupPhrase } from './VerifyBackupPhrase';

// jest.mock('./VerifyBackupPhrase');
// (shuffle as jest.Mock).mockImplementation(() => [
//   'twelve, eleven, ten, nine, eight, seven, six, five, four, three, two, one',
// ]);
jest.spyOn(Math, 'random').mockImplementation(() => 0.123456789);

describe('VerifyBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(
      <VerifyBackupPhrase backupPhrase="one two three four five six seven eight nine ten eleven twelve" />,
    );
    expect(container).toMatchSnapshot();
  });
});
