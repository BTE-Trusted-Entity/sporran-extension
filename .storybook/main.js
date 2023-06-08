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
  ],
  typescript: {
    reactDocgen: 'none', // current version doesn’t work with the recent TS
  },
  webpackFinal: async config => {
    const cssRule = config.module.rules.find(({
      test,
    }) => test.toString() === '/\\.css$/');

    const cssLoaderOptions = cssRule.use[1].options;
    cssLoaderOptions.modules = { namedExport: true };

    config.resolve.alias = {
      ...config.resolve.alias,
      'webextension-polyfill-ts': require.resolve('../src/__mocks__/webextension-polyfill-ts.ts'),
    };

    return config;
  },
};
