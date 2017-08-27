/**
 * @author lnyi <lnyielea@gmail.com>
 */
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import swigMinifier from 'swig-minifier';

swigMinifier.init({
  cacheType: 'memory',
  hashGen: 'sha512'
});

swigMinifier.clearCache();

export default (app, o) => {
  app.engine('html', swigMinifier.engine);
  app.set('view engine', 'html');
  app.set('views', o.viewsPath);
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
};
