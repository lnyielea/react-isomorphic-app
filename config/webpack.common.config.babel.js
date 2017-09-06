/**
 * @author lnyi <lnyielea@gmail.com>
 */
import path from 'path';
import webpack from 'webpack';
import glob from 'glob';
/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved,import/extensions */
import FileMapPlugin from 'webpack-file-map-plugin';
// import FileMapPlugin from '../../webpack-file-map-plugin/index';
/* eslint-enable import/no-extraneous-dependencies,import/no-unresolved,import/extensions */

function join(d) {
  return path.join(__dirname, d);
}
const webpackConfig = {
  entry: {
    vendors: ['react', 'react-dom', 'react-router-dom', 'moment', 'extends']
  },
  output: {
    path: join('../build/static/dist/'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 20
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors', 'manifest'],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`
      },
      client: true,
    }),
    new FileMapPlugin({ output: join(`../${process.env.NODE_PATH}/static/fileMap.json`) })
  ],
  resolve: {
    extensions: ['.js', '.json', '.es6', '.jsx'],
  }
};
const files = glob.sync(path.join(__dirname, '../*'));
const alias = {};
files.map(
  (file) => {
    const key = file.replace(path.join(__dirname, '../'), '');
    alias[key] = file;
    return null;
  }
);
webpackConfig.resolve.alias = alias;
export default webpackConfig;
