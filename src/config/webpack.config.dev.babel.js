/**
 * @author lnyi <lnyielea@gmail.com>
 */

import webpack from 'webpack';
// import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import path from 'path';
import webpackConfig from './webpack.config.common.babel';

webpackConfig.entry.app = [
  'babel-polyfill',
  'react-hot-loader/patch',
  'webpack-hot-middleware/client',
  path.join(__dirname, '../entries/app.jsx'),
];
webpackConfig.output.filename = '[name].js';
webpackConfig.module.rules.push({
  test: /\.jsx$/,
  exclude: /node_modules/,
  loaders: ['react-hot-loader/webpack', 'babel-loader?cacheDirectory']
});
webpackConfig.module.rules.push({
  test: /\.less$/,
  exclude: /node_modules/,
  loader: 'style-loader!css-loader?modules=true!less-loader'
});
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
// webpackConfig.plugins.push(new ExtractCssChunks({filename: '[name].[contenthash:6].css'}));
webpackConfig.devtool = 'source-map';
webpackConfig.watch = true;

export default webpackConfig;
