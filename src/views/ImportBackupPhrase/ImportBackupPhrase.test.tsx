import userEvent from '@testing-library/user-event';
import { mnemonicValidate } from '@polkadot/util-crypto';

import { getKeypairByBackupPhrase } from '../../utilities/identities/identities';
import { render, screen } from '../../testing/testing';

import { ImportBackupPhrase } from './ImportBackupPhrase';

jest.mock('@polkadot/util-crypto', () => ({
  mnemonicValidate: jest.fn(),
}));
jest.mock('../../utilities/identities/identities', () => ({
  getKeyPairByBackupPhrase: jest.fn(),
}));

(mnemonicValidate as jest.Mock).mockReturnValue(false);

const onImport = jest.fn();

const invalidBackupPhrase = 'The entered backup phrase doesn’t exist';
const mismatchingBackupPhrase =
  'This is not the backup phrase of this Identity';
const backupPhraseNotLongEnough =
  'Please insert all 12 words of the backup phrase in the correct order';
const typo = 'It looks like there’s a typo in this word';

const props = {
  onImport,
};

async function typeElevenWords() {
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
}

describe('ImportBackupPhrase', () => {
  beforeEach(() => {
    (getKeypairByBackupPhrase as jest.Mock).mockReset();
  });

  it('should render for import', async () => {
    const { container } = render(<ImportBackupPhrase {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('should render for reset', async () => {
    const { container } = render(
      <ImportBackupPhrase
        {...props}
        type="reset"
        address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should report backup word not within library', async () => {
    render(<ImportBackupPhrase {...props} />);

    userEvent.type(await screen.findByLabelText('1'), 'oooooo');

    expect(
      await screen.findByText(typo, { selector: ':not([hidden])' }),
    ).toBeInTheDocument();
  });

  it('should ignore whitespace and be case-insensitive', async () => {
    render(<ImportBackupPhrase {...props} />);

    userEvent.type(await screen.findByLabelText('1'), ' Century');
    userEvent.click(await screen.findByText('Next Step'));

    expect(
      await screen.findByText(backupPhraseNotLongEnough),
    ).toBeInTheDocument();
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

    await typeElevenWords();
    userEvent.type(await screen.findByLabelText('12'), 'brain');

    userEvent.click(await screen.findByText('Next Step'));

    expect(await screen.findByText(invalidBackupPhrase)).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should report mismatching backup phrase', async () => {
    (mnemonicValidate as jest.Mock).mockReturnValue(true);
    (getKeypairByBackupPhrase as jest.Mock).mockReturnValue({
      address: 'FAIL',
    });

    render(<ImportBackupPhrase {...props} type="reset" address="foo" />);

    await typeElevenWords();
    userEvent.type(await screen.findByLabelText('12'), 'fog');

    userEvent.click(await screen.findByText('Next Step'));

    expect(
      await screen.findByText(mismatchingBackupPhrase),
    ).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should allow backup phrase import', async () => {
    (mnemonicValidate as jest.Mock).mockReturnValue(true);
    (getKeypairByBackupPhrase as jest.Mock).mockReturnValue({
      address: 'PASS',
    });

    render(<ImportBackupPhrase {...props} address="PASS" />);

    await typeElevenWords();
    userEvent.type(await screen.findByLabelText('12'), 'fog');

    expect(screen.queryByText(invalidBackupPhrase)).not.toBeInTheDocument();
    expect(
      screen.queryByText(typo, { selector: ':not([hidden])' }),
    ).not.toBeInTheDocument();

    userEvent.click(await screen.findByText('Next Step'));
    expect(onImport).toHaveBeenCalledWith(
      'century answer price repeat carpet truck swarm boost fine siege brain fog',
    );
  });

  it('should allow backup phrase reset', async () => {
    (mnemonicValidate as jest.Mock).mockReturnValue(true);
    (getKeypairByBackupPhrase as jest.Mock).mockReturnValue({
      address: '4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos',
    });

    render(
      <ImportBackupPhrase
        {...props}
        type="reset"
        address="4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos"
      />,
    );

    await typeElevenWords();
    userEvent.type(await screen.findByLabelText('12'), 'fog');

    expect(screen.queryByText(invalidBackupPhrase)).not.toBeInTheDocument();
    expect(screen.queryByText(mismatchingBackupPhrase)).not.toBeInTheDocument();
    expect(
      screen.queryByText(typo, { selector: ':not([hidden])' }),
    ).not.toBeInTheDocument();

    userEvent.click(await screen.findByText('Next Step'));
    expect(onImport).toHaveBeenCalledWith(
      'century answer price repeat carpet truck swarm boost fine siege brain fog',
    );
  });
});
