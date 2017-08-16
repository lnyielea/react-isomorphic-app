/**
 * @author lnyi <lnyielea@gmail.com>
 */
import express from 'express'
import path from 'path'
import Debug from 'debug'
import http from 'http'
import masterBind from './masterBind'
import reactHotBind from './reactHotBind'
import renderWrap from './renderWrap'
import addQueryString from './addQueryString'
import addJsonHelper from './addJsonHelper'
import loadControllers from './loadControllers'

const debug = Debug("web:server");

function createExpress(o) {
  let app, middlewares;

  app = express();
  o = o || {};
  middlewares = o.middlewares;

  // express main options
  masterBind(app, o);
  app.use(renderWrap);
  // bind page router
  addQueryString(app);
  addJsonHelper(app);
  if(process.env.NODE_ENV == "development") {
    /**
     * on development, the app.use for prevent express cache router.
     */
    app.use((req, res, next) => {
      loadControllers((router) => {
        router(req, res, next);
      });
    });
    if(app.get("env") == "development") {
      // react-hot
      reactHotBind(app, o);
    }
    createServer(app, o);
  }
  else {
    loadControllers((router) => {
      app.use(router);
      app.get("*", (req, res) => {
        console.log(req.url);
        res.render("index.html");
      });
      createServer(app, o);
    });
  }
};

function createServer(app, o) {
  app.use(express.static(o.staticPath));

  // 500 error
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  // 404 error
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404);
    res.end();
    // next(err);
  });

  var port = normalizePort(o.port || '3000');
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  console.log(`server start on port ${port}`);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    var port = parseInt(val, 10);

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

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    console.log(error);
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  };
};

module.exports = createExpress;
