/**
 * @author lnyi <lnyielea@gmail.com>
 */
import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import glob from 'glob'
import FileMapPlugin from 'webpack-file-map-plugin'
// import FileMapPlugin from '../../webpack-file-map-plugin/index'

function join(d) {
  var r;

  r =  path.join(__dirname, d);
  return r;
};
const webpackConfig = {
    entry: {
        vendors: ['react', 'react-dom', 'react-router-dom', 'moment', 'extends']
    },
    output: {
        path: join("../../build/static/dist/"),
        publicPath: "/dist/"
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
            'NODE_ENV': `"${process.env.NODE_ENV}"`
          },
          'client': true,
        }),
        new FileMapPlugin({output: join("../static/fileMap.json")})
    ],
    resolve: {
        extensions: ['.js','.json','.es6','.jsx'],

    }
}
export default webpackConfig;
