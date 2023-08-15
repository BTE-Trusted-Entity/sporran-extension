export default {
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-controls',
    '@storybook/addon-toolbars',
    { name: '@storybook/addon-styling', options: { cssModules: { namedExport: true } } },
  ],
  webpackFinal: async config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'webextension-polyfill': require.resolve('../src/__mocks__/webextension-polyfill.ts'),
    };

    return config;
  },
};
