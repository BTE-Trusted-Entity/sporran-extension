import { usePasteButton } from './usePasteButton';

jest.mock('./usePasteButton');

jest.mocked(usePasteButton).mockImplementation(() => ({
  supported: true,
  handlePasteClick: jest.fn(),
  className: 'paste',
  title: 'Paste to clipboard',
}));
