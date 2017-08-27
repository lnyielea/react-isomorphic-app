/**
 * @author lnyi <lnyielea@gmail.com>
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import Routes from '../routes';

const resourcePath = location.pathname.substring(1) || '/index';

function renderApp(mod, Main) {
  const dom = (
    <AppContainer>
      <BrowserRouter><Main resourcePath={resourcePath} mod={mod} /></BrowserRouter>
    </AppContainer>
  );
  ReactDOM.render((dom), document.getElementById('app'));
}

/**
 *
 * development env, first load don't isomorphic for hot load, mey jitter.
 *
 */

let loadDevApp;

if (process.env.NODE_ENV === 'development') {
  loadDevApp = function loadDevAppFN() {
    function render(Main) {
      const mod = null;
      renderApp(mod, Main);
    }
    render(Routes);

    if (module.hot) {
      module.hot.accept(
        '../routes',
        () => {
          /* eslint-disable global-require */
          const hotRoutes = require('../routes').default;
          /* eslint-enable global-require */
          render(hotRoutes);
        }
      );
    }
  };
  loadDevApp();
}

/**
 *
 * production env, preload cur router module and render to app
 *
 */

let loadApp;

if (process.env.NODE_ENV === 'production') {
  loadApp = function loadAppFN() {
    System.import(`../pages/${resourcePath}`).then(
      (mod) => {
        renderApp(mod.default, Routes);
      }
    );
  };

  loadApp();
}
