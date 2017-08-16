/**
 * @author lnyi <lnyielea@gmail.com>
 */

import url from 'url'

export default (app) => {
  function getJsonHelper(res) {
    return {
      out(code, message, data) {
        const jsonData = {
          code,
          message,
          data
        }
        res.end(JSON.stringify(jsonData));
      },

      success(data) {
        this.out(1, "", data);
      },

      error(code, message) {
        if(arguments.length == 1) {
          message = code;
          code = 0;
        }
        this.out(code, message);
      }
    }
  };
  app.use((req, res, next) => {
    const jsonHelper = getJsonHelper(res);
    res.json = jsonHelper;
    next();
  });
}