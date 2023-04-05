import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { MemoryRouter } from 'react-router-dom';

import { defaultEndpoint } from '../src/utilities/endpoints/endpoints';
import { localeGlobalTypes, withLocale } from './locales';
import {
  configurationTypesForStorybook,
  withConfigurationProvider,
} from '../src/configuration/configurationForStorybook';
import { IdentitiesProviderMock } from '../src/utilities/identities/IdentitiesProvider.mock';
import { CredentialsProviderMock } from '../src/utilities/credentials/CredentialsProvider.mock';
import { ApiProvider } from '../src/utilities/initKiltSDK/ApiProvider';
import { ViewDecorator } from '../src/components/View/ViewDecorator';
import '../src/views/App/App.css';

export const globalTypes = {
  ...localeGlobalTypes,
  ...configurationTypesForStorybook,
};

export const decorators = [
  withLocale,
  withConfigurationProvider,
  ViewDecorator,

  (Story) => (
    <MemoryRouter>
      <IdentitiesProviderMock>
        <CredentialsProviderMock>
          <ApiProvider>
            <Story />
          </ApiProvider>
        </CredentialsProviderMock>
      </IdentitiesProviderMock>
    </MemoryRouter>
  ),
];

export const parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      popup: {
        name: 'Extension Popup',
        type: 'desktop',
        styles: {
          height: '600px',
          width: '480px',
        },
      },
    },
    defaultViewport: 'popup',
  },
  layout: 'fullscreen',
};
