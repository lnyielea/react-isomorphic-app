/**
 * @author lnyi <lnyielea@gmail.com>
 */
import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import extend from 'extend';
import LazyLoad from './components/lazyLoad';
import ModCssWrap from './components/modCssWrap';
import routesConfig from './routesConfig';
import mainStyle from './pages/main.less';

export default class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className={mainStyle['main-menu']}>
          <div className={mainStyle['menu-column']}>
            <strong>SPA menu</strong>
            <p><Link to="/index">index</Link></p>
            <p><Link to="/list">list</Link></p>
            <p><Link to="/user">user</Link></p>
            <p><Link to="/subPage/index">subPage/index</Link></p>
          </div>
          <div className={mainStyle['menu-column']}>
            <strong>MPA menu</strong>
            <p><a href="/index">index</a></p>
            <p><a href="/list">list</a></p>
            <p><a href="/user">user</a></p>
            <p><a href="/subPage/index">subPage/index</a></p>
          </div>
        </div>

        <div className={mainStyle['main-box']}>
          <Switch>
            {
              routesConfig.map(
                (config) => {
                  let path; // request path
                  let resourcePath; // resource path

                  if (typeof config === 'object') {
                    path = config.path;
                    resourcePath = config.resourcePath;
                  } else {
                    path = `/${config}`;
                    resourcePath = config;
                  }
                  const render = (props) => {
                    // current request path
                    const currentPathname = this.props.resourcePath;
                    let componentProps = props;
                    let Child;
                    let Mod;
                    // server side, direct include module component
                    if (typeof System === 'undefined') {
                      /* eslint-disable global-require, import/no-dynamic-require */
                      Mod = require(`./pages/${resourcePath}`).default;
                      /* eslint-disable global-require, import/no-dynamic-require */
                      Child = Mod;
                    } else if (currentPathname && currentPathname === resourcePath) {
                      // client side
                      // if exists current path and equal resource path
                      Mod = this.props.mod;
                      // in development, mod will be null. so use LazyLoad load component
                      if (!Mod) {
                        Mod = LazyLoad;
                      }
                      Child = Mod;
                    } else {
                      Child = LazyLoad;
                    }
                    componentProps = extend({}, this.props, props);
                    if (Child !== LazyLoad) {
                      return (
                        <ModCssWrap resourcePath={resourcePath}>
                          <Child {...componentProps} resourcePath={resourcePath} />
                        </ModCssWrap>
                      );
                    }
                    return <Child {...componentProps} resourcePath={resourcePath} />;
                  };
                  return <Route path={path} component={render} key={path} />;
                }
              )
            }
          </Switch>
        </div>
      </div>
    );
  }
}
