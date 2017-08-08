/**
 * @author lnyi <lnyielea@gmail.com>
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import Routes from '../routes'

const resourcePath = location.pathname.substring(1) || "/index";

function renderApp(mod, Main) {
  const dom = <AppContainer><BrowserRouter><Main resourcePath={resourcePath} mod={mod} /></BrowserRouter></AppContainer>;
  ReactDOM.render((dom), document.getElementById("app"));
};

/**
 *
 * development env, first load don't isomorphic for hot load, mey jitter.
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
 * production env, preload cur router module and render to app
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
