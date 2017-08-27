/**
 * @author lnyi <lnyielea@gmail.com>
 */

import glob from 'glob';
import path from 'path';
import express from 'express';
import pageRoutesBind from './pageRoutesBind';

const router = express.Router();

export default (fn) => {
  /**
   * path.join for fix unknown bug
   * here use glob and require the pwd is root. I don't known why
   */
  const pattern = path.join(__dirname, '../controllers/**/*.js');
  const bindedControllerCache = {};
  glob(
    pattern,
    (err, files) => {
      /**
       * clean bind route
       */
      if (process.env.NODE_ENV === 'development') {
        router.stack = [];
      }
      files.map(
        (file) => {
          try {
            if (process.env.NODE_ENV === 'development') {
              delete require.cache[file];
            }
            /* eslint-disable global-require, import/no-dynamic-require */
            const controllers = require(file).default;
            /* eslint-enable global-require, import/no-dynamic-require */
            controllers.map((controller) => {
              bindedControllerCache[controller.path] = 1;
              router[controller.method](controller.path, controller.handler);
              return null;
            });
          } catch (e) { console.log(e); }
          return null;
        }
      );
      pageRoutesBind(router, bindedControllerCache);
      if (fn) {
        fn(router);
      }
    }
  );
};

