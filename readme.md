A react ismmorphic app.  Compatibility with SPA(Single Page App) and MPA(Multi Page App).

Use webpack-file-map-plugin extract dependency and load css file from page chunk.

Use babel-plugin-css-modules-transform add css-modules on server side through babel build.

express controller hot reload.

use NODE_PATH require module. same node side and webpack.

# base on

react v15.6.1

react-router-dom v4.1.1

webpack v3.4.1

express v4.15.3

# npm script

`npm run dev` will start dev server.

`npm run dev:debug` will start dev server with debug.

`npm run build` will exec "npm run build:server" and "npm run build:client"

`npm run build:server` will build server code to es5.

`npm run build:client` will build client code to build/static/dist dir. need exec "nom run build:server" to build webpack.config file.

`npm run prod` will start production env server.