const webpack = require('webpack');
const path = require('path');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-controls/register',
    '@storybook/addon-toolbars/register',
  ],
  typescript: {
    reactDocgen: 'none', // current version doesn’t work with recent TS
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'webextension-polyfill-ts': require.resolve('../src/__mocks__/webextension-polyfill-ts.ts'),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      'crypto': require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
    };

    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: ['process'],
      }),
    ];

    return config;
  },
};
