/**
 * @author lnyi <lnyielea@gmail.com>
 */

import glob from 'glob'
import path from 'path'
import express from 'express'
import pageRoutesBind from './pageRoutesBind'

const router = express.Router();

export default (fn) => {
  /**
   * path.join for fix unknown bug
   * here use glob and require the pwd is root. I don't known why
   */
  const pattern = path.join(__dirname, "../controllers/**/*.js");
  const bindedControllerCache = {};
  glob(pattern, (err, files) => {
    /**
     * clean bind route
     */
    console.log(files);
    if(process.env.NODE_ENV == "development") {
      router.stack = [];
    }
    files.map((file) => {
      try {
        file = file.split("controllers/")[1];
        const requirePath = path.join(__dirname, `../controllers/${file}`);
        if(process.env.NODE_ENV == "development") {
          const modulePath = require.resolve(requirePath);
          delete require.cache[modulePath];
        }
        const controllers = require(requirePath).default;
        controllers.map((controller) => {
          bindedControllerCache[controller.path] = 1;
          router[controller.method](controller.path, controller.handler);
        });
      }
      catch(e) { console.log(e); }
    });
    pageRoutesBind(router, bindedControllerCache);
    fn && fn(router);
  });
};

