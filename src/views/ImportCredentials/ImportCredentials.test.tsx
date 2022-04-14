import { identitiesMock, render } from '../../testing/testing';

import { ImportCredentialsForm } from './ImportCredentialsForm';
import { ImportCredentialsResults } from './ImportCredentialsResults';

describe('ImportCredentials', () => {
  describe('ImportCredentialsForm', () => {
    it('should match the snapshot', async () => {
      const { container } = render(
        <ImportCredentialsForm handleFiles={jest.fn()} />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('ImportCredentialsResults', () => {
    it('should match the snapshot', async () => {
      const { container } = render(
        <ImportCredentialsResults
          pending={[{ fileName: 'Email-1.json' }]}
          grouped={[
            {
              identity:
                identitiesMock[
                  '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'
                ],
              imports: [
                {
                  fileName: 'Twitter-1.json',
                  identityAddress:
                    '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
                },
                {
                  fileName:
                    'Twitter-2-very-long-name-that-overflows-the-space.json',
                  identityAddress:
                    '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
                },
              ],
            },
          ]}
          failedImports={[
            { fileName: 'Dotsama-1.json', error: 'invalid' },
            {
              fileName:
                'Dotsama-2-very-long-name-that-overflows-the-space.json',
              error: 'orphaned',
            },
            { fileName: 'Dotsama-2.json', error: 'unknown' },
          ]}
          setFailedImports={jest.fn()}
          handleMoreClick={jest.fn()}
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
