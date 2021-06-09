import webpack from 'webpack';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

export default {
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
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4 * 1024,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.module.css', '.json'],
  },
  plugins: [
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
  ],
};
