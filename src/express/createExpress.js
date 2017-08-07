/**
 * @author lnyi <lnyielea@gmail.com>
 */
import express from 'express'
import path from 'path'
import Debug from 'debug'
import http from 'http'
import masterBind from './masterBind'
import reactHotBind from './reactHotBind'
import pageRoutesBind from './pageRoutesBind'
import renderWrap from './renderWrap'

const debug = Debug("web:server");

function createExpress(o) {
  let app, middlewares;

  app = express();
  o = o || {};
  middlewares = o.middlewares;

  // express 主要配置
  masterBind(app, o);
  if(app.get("env") == "development") {
    // react-hot 配置
    reactHotBind(app, o);
  }
  app.use(renderWrap);
  // 绑定路由
  pageRoutesBind(app, o);
  if(middlewares) {
    if(!(middlewares instanceof Array)) {
      middlewares = [middlewares];
    }
    middlewares.forEach((middleware) => {
      app.use(middleware);
    });
  }
  createServer(app, o);
};

function createServer(app, o) {
  app.use(express.static(o.staticPath));

  // 500错误处理
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

  // 404错误处理
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
