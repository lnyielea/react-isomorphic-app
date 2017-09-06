/**
 * @author lnyi <lnyielea@gmail.com>
 */

import webpack from 'webpack';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import webpackConfig from './webpack.common.config.babel';

webpackConfig.entry.app = [
  './src/entries/app.jsx',
];
webpackConfig.output.filename = '[name].[chunkhash:6].js';
webpackConfig.module.rules.push({
  test: /\.jsx$/,
  exclude: /node_modules/,
  loaders: ['babel-loader']
});
webpackConfig.module.rules.push({
  test: /\.less$/,
  exclude: /node_modules/,
  use: ExtractCssChunks.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
      'less-loader',
    ]
  })
});
webpackConfig.plugins.push(new ExtractCssChunks({ filename: '[name].[contenthash:6].css' }));
webpackConfig.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);

export default webpackConfig;
