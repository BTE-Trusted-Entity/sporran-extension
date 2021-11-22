import { isFullDid, getFragment } from './did';

jest.mock('./did');

export function mockIsFullDid(boolean: boolean): void {
  (isFullDid as jest.Mock).mockReturnValue(boolean);
}

(getFragment as jest.Mock).mockImplementation((id) => id.replace(/^.*#/, ''));
