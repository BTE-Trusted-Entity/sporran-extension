import { merge } from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import common from './webpack.common.js';

export default merge(common, {
  mode: 'production',
  plugins: [new BundleAnalyzerPlugin()],
});
