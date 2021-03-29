import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

export default {
  entry: {
    backgroundPage: path.resolve('./src/backgroundPage.ts'),
    popup: path.resolve('./src/popup.tsx'),
  },
  output: {
    path: path.resolve('./dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        exclude: /node_modules/,
        test: /\.module.css$/,
        use: [
          {
            loader: 'style-loader', // Creates style nodes from JS strings
          },
          {
            loader: '@teamsupercell/typings-for-css-modules-loader', // Help TS deal with CSS Modules
          },
          {
            loader: 'css-loader', // Translates CSS into CommonJS
          },
        ],
      },
      {
        test: /App.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|woff2)$/i,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.module.css', '.json'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('./src/static/'),
          to: path.resolve('./dist/'),
        },
      ],
    }),
  ],
};
