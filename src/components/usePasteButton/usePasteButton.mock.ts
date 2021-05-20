import { usePasteButton } from './usePasteButton';

jest.mock('./usePasteButton');

(usePasteButton as jest.Mock).mockImplementation(() => ({
  supported: true,
  handlePasteClick: jest.fn(),
  className: 'paste',
  title: 'Paste to clipboard',
}));
