import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { ImportCredentials } from './ImportCredentials';
import { ImportCredentialsForm } from './ImportCredentialsForm';
import { ImportCredentialsResults } from './ImportCredentialsResults';

export default {
  title: 'Views/ImportCredentials',
  component: ImportCredentials,
} as Meta;

export function Flow(): JSX.Element {
  return <ImportCredentials />;
}

export function Form(): JSX.Element {
  return <ImportCredentialsForm handleFiles={action('handleFiles')} />;
}

export function Results(): JSX.Element {
  return (
    <ImportCredentialsResults
      pending={[{ fileName: 'Email-1.json' }]}
      grouped={[
        {
          identity:
            identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'],
          imports: [
            {
              fileName: 'Twitter-1.json',
              identityAddress:
                '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
            },
            {
              fileName:
                'Twitter-2-very-long-name-that-overflows-the-space.json',
              identityAddress:
                '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
            },
          ],
        },
      ]}
      failedImports={[
        { fileName: 'Dotsama-1.json', error: 'invalid' },
        {
          fileName: 'Dotsama-2-very-long-name-that-overflows-the-space.json',
          error: 'orphaned',
        },
        { fileName: 'Dotsama-2.json', error: 'unknown' },
      ]}
      setFailedImports={action('setFailedImports')}
      handleMoreClick={action('handleMoreClick')}
    />
  );
}
