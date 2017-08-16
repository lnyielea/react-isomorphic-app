/**
 * @author lnyi <lnyielea@gmail.com>
 */

import url from 'url'

export default (app) => {
  app.use((req, res, next) => {
    req.queryString = url.parse(req.url).query;
    next();
  });
}