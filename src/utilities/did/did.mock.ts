import { isFullDid } from './did';

jest.mock('./did');

export function mockIsFullDid(boolean: boolean): void {
  (isFullDid as jest.Mock).mockReturnValue(boolean);
}
