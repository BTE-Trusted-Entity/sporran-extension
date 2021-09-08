import path from 'node:path';
import { createRequire } from 'node:module';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import ExtensionReloader from 'webpack-extension-reloader';

const require = createRequire(import.meta.url);
const isDevelopment = process.env.NODE_ENV !== 'production';

export default {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    backgroundScript: path.resolve('./src/backgroundScript.ts'),
    popupScript: path.resolve('./src/popupScript.tsx'),
    contentScript: path.resolve('./src/contentScript.ts'),
    injectedScript: path.resolve('./src/injectedScript.ts'),
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
      {
        use: [
          'style-loader', // Creates style nodes from JS strings
          '@teamsupercell/typings-for-css-modules-loader', // Help TS deal with CSS Modules
          'css-loader', // Translates CSS into CommonJS
        ],
        test: /\.module.css$/,
        exclude: /node_modules/,
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /App.css$/,
      },
      {
        type: 'asset',
        test: /\.(png|svg|woff2)$/i,
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.module.css', '.json'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process'],
    }),
    new webpack.DefinePlugin({
      VARIANT: JSON.stringify(process.env.VARIANT),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('./src/static/'),
          to: path.resolve('./dist/'),
        },
      ],
    }),
    ...(isDevelopment ? [new ExtensionReloader()] : []),
  ],
  ...(isDevelopment && { devtool: 'inline-source-map' }),
};
