/**
 * app入口文件
 * @author lnyi <lnyielea@gmail.com>
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import Routes from '../routes'

const resourcePath = location.pathname.substring(1) || "/";

function renderApp(mod, Main) {
  const dom = <AppContainer><BrowserRouter><Main resourcePath={resourcePath} mod={mod} /></BrowserRouter></AppContainer>;
  ReactDOM.render((dom), document.getElementById("app"));
};

/**
 *
 * 开发环境，首次加载为了热更新不考虑同构。一定程度上会导致抖动
 *
 */
if(process.env.NODE_ENV == "development") {
  function loadDevApp() {
    function render(Main) {
      const mod = null;
      renderApp(mod, Main);
    };
    render(Routes);

    if (module.hot) {
      module.hot.accept("../routes", () => {
        const hotRoutes = require("../routes")["default"];
        render(hotRoutes);
      })
    }
  };
  loadDevApp();
}

/**
 *
 * 生产环境，预先加载当前路由对应模块，然后加载到路由完成同构
 *
 */
if(process.env.NODE_ENV == "production") {
  function loadApp() {
    System.import(`../pages/${resourcePath}`).then((mod) => {
      mod = mod["default"];
      renderApp(mod, Routes);
    });
  };

  loadApp();
}
