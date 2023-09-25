import { userEvent } from '@testing-library/user-event';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { KiltKeyringPair, Utils } from '@kiltprotocol/sdk-js';

import { render, screen } from '../../testing/testing';

import { ImportBackupPhrase } from './ImportBackupPhrase';

jest.mock('@polkadot/util-crypto', () => ({
  mnemonicValidate: jest.fn(),
}));

jest.mocked(mnemonicValidate).mockReturnValue(false);

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
  await userEvent.type(await screen.findByLabelText('1'), 'century');
  await userEvent.type(await screen.findByLabelText('2'), 'answer');
  await userEvent.type(await screen.findByLabelText('3'), 'price');
  await userEvent.type(await screen.findByLabelText('4'), 'repeat');
  await userEvent.type(await screen.findByLabelText('5'), 'carpet');
  await userEvent.type(await screen.findByLabelText('6'), 'truck');
  await userEvent.type(await screen.findByLabelText('7'), 'swarm');
  await userEvent.type(await screen.findByLabelText('8'), 'boost');
  await userEvent.type(await screen.findByLabelText('9'), 'fine');
  await userEvent.type(await screen.findByLabelText('10'), 'siege');
  await userEvent.type(await screen.findByLabelText('11'), 'brain');
}

describe('ImportBackupPhrase', () => {
  beforeEach(() => {
    jest.mocked(Utils.Crypto.makeKeypairFromUri).mockReset();
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
        address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should report backup word not within library', async () => {
    render(<ImportBackupPhrase {...props} />);

    await userEvent.type(await screen.findByLabelText('1'), 'oooooo');

    expect(
      await screen.findByText(typo, { selector: ':not([hidden])' }),
    ).toBeInTheDocument();
  });

  it('should ignore whitespace and be case-insensitive', async () => {
    render(<ImportBackupPhrase {...props} />);

    await userEvent.type(await screen.findByLabelText('1'), ' Century');
    await userEvent.click(await screen.findByText('Next Step'));

    expect(
      await screen.findByText(backupPhraseNotLongEnough),
    ).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should report backup phrase not long enough', async () => {
    render(<ImportBackupPhrase {...props} />);

    await userEvent.type(await screen.findByLabelText('1'), 'century');
    await userEvent.click(await screen.findByText('Next Step'));

    expect(
      await screen.findByText(backupPhraseNotLongEnough),
    ).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should report invalid backup phrase', async () => {
    render(<ImportBackupPhrase {...props} />);

    await typeElevenWords();
    await userEvent.type(await screen.findByLabelText('12'), 'brain');

    await userEvent.click(await screen.findByText('Next Step'));

    expect(await screen.findByText(invalidBackupPhrase)).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should report mismatching backup phrase', async () => {
    jest.mocked(mnemonicValidate).mockReturnValue(true);
    jest.mocked(Utils.Crypto.makeKeypairFromUri).mockReturnValue({
      address: 'FAIL',
    } as unknown as KiltKeyringPair);

    render(<ImportBackupPhrase {...props} type="reset" address="foo" />);

    await typeElevenWords();
    await userEvent.type(await screen.findByLabelText('12'), 'fog');

    await userEvent.click(await screen.findByText('Next Step'));

    expect(
      await screen.findByText(mismatchingBackupPhrase),
    ).toBeInTheDocument();
    expect(onImport).not.toHaveBeenCalled();
  });

  it('should allow backup phrase import', async () => {
    jest.mocked(mnemonicValidate).mockReturnValue(true);
    jest.mocked(Utils.Crypto.makeKeypairFromUri).mockReturnValue({
      address: 'PASS',
    } as unknown as KiltKeyringPair);

    render(<ImportBackupPhrase {...props} address="PASS" />);

    await typeElevenWords();
    await userEvent.type(await screen.findByLabelText('12'), 'fog');

    expect(screen.queryByText(invalidBackupPhrase)).not.toBeInTheDocument();
    expect(
      screen.queryByText(typo, { selector: ':not([hidden])' }),
    ).not.toBeInTheDocument();

    await userEvent.click(await screen.findByText('Next Step'));
    expect(onImport).toHaveBeenCalledWith(
      'century answer price repeat carpet truck swarm boost fine siege brain fog',
    );
  });

  it('should allow backup phrase reset', async () => {
    jest.mocked(mnemonicValidate).mockReturnValue(true);
    jest.mocked(Utils.Crypto.makeKeypairFromUri).mockReturnValue({
      address: '4p273cfeZ2JRz46AcJoQvTRHCH8Vaj92jts2VxepZtQwbTBB',
    } as unknown as KiltKeyringPair);

    render(
      <ImportBackupPhrase
        {...props}
        type="reset"
        address="4p273cfeZ2JRz46AcJoQvTRHCH8Vaj92jts2VxepZtQwbTBB"
      />,
    );

    await typeElevenWords();
    await userEvent.type(await screen.findByLabelText('12'), 'fog');

    expect(screen.queryByText(invalidBackupPhrase)).not.toBeInTheDocument();
    expect(screen.queryByText(mismatchingBackupPhrase)).not.toBeInTheDocument();
    expect(
      screen.queryByText(typo, { selector: ':not([hidden])' }),
    ).not.toBeInTheDocument();

    await userEvent.click(await screen.findByText('Next Step'));
    expect(onImport).toHaveBeenCalledWith(
      'century answer price repeat carpet truck swarm boost fine siege brain fog',
    );
  });
});
