import { isFullDid, getFragment } from './did';

jest.mock('./did');

export function mockIsFullDid(boolean: boolean): void {
  jest.mocked(isFullDid).mockReturnValue(boolean);
}

jest.mocked(getFragment).mockImplementation((id) => id.replace(/^.*#/, ''));
