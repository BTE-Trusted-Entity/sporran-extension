import userEvent from '@testing-library/user-event';
import { render, screen } from '../../testing';

import { ImportBackupPhrase } from './ImportBackupPhrase';

const onImport = jest.fn();

const invalidBackupPhrase = 'The entered backup phrase doesn’t exist';
const backupPhraseNotLongEnough =
  'Please insert all the words of the backup phrase';
const typo = 'It looks like there’s a typo in word $number$: “$word$”';

const props = {
  onImport,
};

describe('ImportBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(<ImportBackupPhrase {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('should report backup word not within library', async () => {
    render(<ImportBackupPhrase {...props} />);

    userEvent.type(await screen.findByLabelText('1'), 'oooooo');
    userEvent.click(await screen.findByText('Next Step'));

    expect(await screen.findByText(typo)).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should report backup phrase not long enough', async () => {
    render(<ImportBackupPhrase {...props} />);

    userEvent.type(await screen.findByLabelText('1'), 'century');
    userEvent.click(await screen.findByText('Next Step'));

    expect(
      await screen.findByText(backupPhraseNotLongEnough),
    ).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should report invalid backup phrase', async () => {
    render(<ImportBackupPhrase {...props} />);

    userEvent.type(await screen.findByLabelText('1'), 'century');
    userEvent.type(await screen.findByLabelText('2'), 'answer');
    userEvent.type(await screen.findByLabelText('3'), 'price');
    userEvent.type(await screen.findByLabelText('4'), 'repeat');
    userEvent.type(await screen.findByLabelText('5'), 'carpet');
    userEvent.type(await screen.findByLabelText('6'), 'truck');
    userEvent.type(await screen.findByLabelText('7'), 'swarm');
    userEvent.type(await screen.findByLabelText('8'), 'boost');
    userEvent.type(await screen.findByLabelText('9'), 'fine');
    userEvent.type(await screen.findByLabelText('10'), 'siege');
    userEvent.type(await screen.findByLabelText('11'), 'brain');
    userEvent.type(await screen.findByLabelText('12'), 'brain');

    userEvent.click(await screen.findByText('Next Step'));

    expect(await screen.findByText(invalidBackupPhrase)).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should allow backup phrase', async () => {
    render(<ImportBackupPhrase {...props} />);

    userEvent.type(await screen.findByLabelText('1'), 'century');
    userEvent.type(await screen.findByLabelText('2'), 'answer');
    userEvent.type(await screen.findByLabelText('3'), 'price');
    userEvent.type(await screen.findByLabelText('4'), 'repeat');
    userEvent.type(await screen.findByLabelText('5'), 'carpet');
    userEvent.type(await screen.findByLabelText('6'), 'truck');
    userEvent.type(await screen.findByLabelText('7'), 'swarm');
    userEvent.type(await screen.findByLabelText('8'), 'boost');
    userEvent.type(await screen.findByLabelText('9'), 'fine');
    userEvent.type(await screen.findByLabelText('10'), 'siege');
    userEvent.type(await screen.findByLabelText('11'), 'brain');
    userEvent.type(await screen.findByLabelText('12'), 'fog');

    expect(screen.queryByText(invalidBackupPhrase)).not.toBeInTheDocument();
    expect(screen.queryByText(typo)).not.toBeInTheDocument();

    userEvent.click(await screen.findByText('Next Step'));
    expect(onImport).toHaveBeenCalledWith(
      'century answer price repeat carpet truck swarm boost fine siege brain fog',
    );
  });
});
