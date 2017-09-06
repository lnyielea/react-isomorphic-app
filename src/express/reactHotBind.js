/**
 * @author lnyi <lnyielea@gmail.com>
 */
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../config/webpack.dev.config.babel';

export default (app) => {
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(
      compiler,
      {
        hot: true,
        stats: { colors: true },
        progress: true,
        publicPath: webpackConfig.output.publicPath
      }
    )
  );
  app.use(webpackHotMiddleware(compiler));
};
