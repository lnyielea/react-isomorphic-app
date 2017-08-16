const chokidar = require('chokidar');
const babelConfig = require("./src/config/node.side.babel.options");
const path = require("path");

chokidar.watch("./src").on("all", watchHandle);
chokidar.watch("./data").on("all", watchHandle);
function watchHandle(e, filePath) {
  filePath = path.join(__dirname, filePath);
  if(require.cache[filePath]) {
    if(filePath.indexOf("server.js") != -1) {
      return;
    }
    delete require.cache[filePath];
    try {
      require(filePath);
    }
    catch(e) {}
    console.log(`reload: ${filePath}`);
  }
};
require("babel-register")(babelConfig);
require(`./${process.argv[2]}`);
