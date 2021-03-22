import userEvent from '@testing-library/user-event';
import { render, screen } from '../../testing';

import { ImportBackupPhrase } from './ImportBackupPhrase';

const onImport = jest.fn();

const props = {
  onImport,
};

describe('ImportBackupPhrase', () => {
  it('should render', async () => {
    const { container } = render(<ImportBackupPhrase {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('should enter account', async () => {
    render(<ImportBackupPhrase {...props} />);

    userEvent.type(await screen.findByLabelText('1'), 'century');
    userEvent.click(screen.getByText('Import Account'));
    expect(onImport).not.toHaveBeenCalled();

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
    userEvent.type(await screen.findByLabelText('12'), 'og');

    userEvent.click(screen.getByText('Import Account'));
    expect(onImport).not.toHaveBeenCalled();

    userEvent.clear(await screen.findByLabelText('12'));
    userEvent.type(await screen.findByLabelText('12'), 'fog');
    userEvent.click(screen.getByText('Import Account'));
    expect(onImport).toHaveBeenCalled();
  });
});
