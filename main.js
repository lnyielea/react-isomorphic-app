const babelConfig = require("./src/config/node.side.babel.options")
require("babel-register")(babelConfig);
require("./src/server");
