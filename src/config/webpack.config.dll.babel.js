/**
 * @author lnyi <lnyielea@gmail.com>
 */
import path from 'path';
import webpack from 'webpack';

const vendors = [
  'react',
  'react-dom',
  'react-router-dom',
  'moment',
  'extends'
];

export default {
  output: {
    path: path.join(__dirname, '../static/dist'),
    filename: '[name].[chunkhash:6].js',
    library: '[name]_[chunkhash]',
  },
  entry: {
    vendors
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]_[chunkhash:6]',
      context: path.join(__dirname, '../'),
    }),
  ],
};