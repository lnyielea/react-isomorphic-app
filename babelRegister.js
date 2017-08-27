const chokidar = require('chokidar');
const path = require('path');
const babelConfig = require('./src/config/node.side.babel.options');
const rootFile = process.argv[2];

function watchHandle(e, filePath) {
  const rootFilePath = path.join(__dirname, `${rootFile}.js`);
  const changedFilePath = path.join(__dirname, filePath);
  if (require.cache[changedFilePath]) {
    if (rootFilePath === changedFilePath) {
      return;
    }
    delete require.cache[changedFilePath];
    try {
      require(changedFilePath);
    } catch (e) {}
    console.log(`reload: ${changedFilePath}`);
  }
}
chokidar.watch('./src').on('all', watchHandle);
chokidar.watch('./data').on('all', watchHandle);
require('babel-register')(babelConfig);
require(`./${rootFile}`);
