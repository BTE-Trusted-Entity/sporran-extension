import path from 'node:path';

import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import ExtensionReloader from 'webpack-extension-reloader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

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
    publicPath: '/',
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
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: true,
              },
            },
          },
        ],
        test: /.css$/,
        exclude: /node_modules/,
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
    ...(isDevelopment
      ? [new ExtensionReloader()]
      : [new MiniCssExtractPlugin()]),
  ],
  ...(isDevelopment && { devtool: 'inline-source-map' }),
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};
