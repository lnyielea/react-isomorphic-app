/**
 * @author lnyi <lnyielea@gmail.com>
 */
import express from 'express';
import Debug from 'debug';
import http from 'http';
import masterBind from './masterBind';
import reactHotBind from './reactHotBind';
import renderWrap from './renderWrap';
import addQueryString from './addQueryString';
import addJsonHelper from './addJsonHelper';
import loadControllers from './loadControllers';

const debug = Debug('web:server');

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function createServer(app, o) {
  const port = normalizePort(o.port || '3000');
  let server;
  app.use(express.static(o.staticPath));

  /**
   * Event listener for HTTP server 'error' event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    console.log(error);
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server 'listening' event.
   */

  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }

  // 500 error
  if (app.get('env') === 'development') {
    app.use(
      (err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      }
    );
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(
    (err, req, res) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    }
  );

  // 404 error
  app.use(
    (req, res) => {
      // const err = new Error('Not Found');
      // err.status = 404;
      res.status(404);
      res.end();
      // next(err);
    }
  );

  app.set('port', port);

  /**
   * Create HTTP server.
   */

  server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  console.log(`server start on port ${port}`);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}


function createExpress(o = {}) {
  const app = express();
  // const middlewares = o.middlewares;

  // express main options
  masterBind(app, o);
  app.use(renderWrap);
  // bind page router
  addQueryString(app);
  addJsonHelper(app);
  if (process.env.NODE_ENV === 'development') {
    /**
     * on development, the app.use for prevent express cache router.
     */
    app.use(
      (req, res, next) => {
        loadControllers((router) => {
          router(req, res, next);
        });
      }
    );
    if (app.get('env') === 'development') {
      // react-hot
      reactHotBind(app, o);
    }
    createServer(app, o);
  } else {
    loadControllers((router) => {
      app.use(router);
      createServer(app, o);
    });
  }
}
module.exports = createExpress;
