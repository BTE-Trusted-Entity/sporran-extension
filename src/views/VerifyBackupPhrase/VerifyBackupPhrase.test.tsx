import { userEvent } from '@testing-library/user-event';

import { render, screen } from '../../testing/testing';

import { VerifyBackupPhrase } from './VerifyBackupPhrase';

const backupPhrase =
  'one two three four five six seven eight nine ten eleven twelve';

const backupPhraseWithDupeWord =
  'one two three four five six seven eight nine ten eleven two';

describe('VerifyBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(
      <VerifyBackupPhrase backupPhrase={backupPhrase} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should indicate the correct word', async () => {
    render(<VerifyBackupPhrase backupPhrase={backupPhrase} />);
    await userEvent.click(await screen.findByRole('button', { name: 'one' }));
    expect(await screen.findByRole('button', { name: '01 one' })).toHaveClass(
      'correct',
    );
    expect(
      screen.queryByText('Please put every word in the correct order'),
    ).not.toBeInTheDocument();
  });

  it('should indicate the incorrect word', async () => {
    render(<VerifyBackupPhrase backupPhrase={backupPhrase} />);
    await userEvent.click(await screen.findByRole('button', { name: 'seven' }));
    expect(
      (await screen.findAllByRole('button', { name: 'seven' }))[0],
    ).toHaveClass('incorrect');
    expect(
      await screen.findByText('Please put every word in the correct order'),
    ).toBeInTheDocument();
  });

  it('should handle selection of all words', async () => {
    const { container } = render(
      <VerifyBackupPhrase backupPhrase={backupPhrase} />,
    );
    await userEvent.click(await screen.findByRole('button', { name: 'one' }));
    await userEvent.click(await screen.findByRole('button', { name: 'two' }));
    await userEvent.click(await screen.findByRole('button', { name: 'three' }));
    await userEvent.click(await screen.findByRole('button', { name: 'four' }));
    await userEvent.click(await screen.findByRole('button', { name: 'five' }));
    await userEvent.click(await screen.findByRole('button', { name: 'six' }));
    await userEvent.click(await screen.findByRole('button', { name: 'seven' }));
    await userEvent.click(await screen.findByRole('button', { name: 'eight' }));
    await userEvent.click(await screen.findByRole('button', { name: 'nine' }));
    await userEvent.click(await screen.findByRole('button', { name: 'ten' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'eleven' }),
    );
    await userEvent.click(
      await screen.findByRole('button', { name: 'twelve' }),
    );

    expect(container).toMatchSnapshot();
  });

  it('should handle duplicate words', async () => {
    render(<VerifyBackupPhrase backupPhrase={backupPhraseWithDupeWord} />);
    await userEvent.click(
      (await screen.findAllByRole('button', { name: 'two' }))[0],
    );

    const buttons = await screen.findAllByRole('button', { name: 'two' });
    // button[0] is in the input field
    expect(buttons[1]).toBeDisabled();
    expect(buttons[2]).not.toBeDisabled();
  });
});
