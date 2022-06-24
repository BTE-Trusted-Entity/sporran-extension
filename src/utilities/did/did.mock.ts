import { isFullDid } from './did';

jest.mock('./did');

export function mockIsFullDid(boolean: boolean): void {
  jest.mocked(isFullDid).mockReturnValue(boolean);
}
