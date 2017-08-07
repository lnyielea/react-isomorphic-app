const babelConfig = require("./src/config/node.side.babel.options")
require("babel-register")(babelConfig);
require(`./${process.argv[2]}`);
