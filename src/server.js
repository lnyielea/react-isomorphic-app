import path from 'path';
import createExpress from './express/createExpress';

const viewsPath = path.join(__dirname, './views');
const staticPath = path.join(__dirname, './static');

createExpress({
  viewsPath,
  staticPath,
  port: 8116,
  middlewares: [
    (req, res, next) => {
      next();
    }
  ]
});
