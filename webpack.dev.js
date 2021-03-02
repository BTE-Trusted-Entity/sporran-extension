import { merge } from 'webpack-merge';
import ExtensionReloader from 'webpack-extension-reloader';

import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [new ExtensionReloader()],
});
