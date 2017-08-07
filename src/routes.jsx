/**
 * @author lnyi <lnyielea@gmail.com>
 */
import React, {Component} from "react"
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom'
import extend from "extend"
import LazyLoad from "./components/lazyLoad"
import ModCssWrap from "./components/modCssWrap"
import routesConfig from "./routesConfig"
import mainStyle from "./pages/main.less"

export default class Routes extends Component {
  render() {
    return (
      <div>
        <div className={mainStyle["main-menu"]}>
          <div className={mainStyle["menu-column"]}>
            <strong>SPA menu</strong>
            <p><Link to="/index">index</Link></p>
            <p><Link to="/list">list</Link></p>
            <p><Link to="/user">user</Link></p>
            <p><Link to="/subPage/index">subPage/index</Link></p>
          </div>
          <div className={mainStyle["menu-column"]}>
            <strong>MPA menu</strong>
            <p><a href="/index">index</a></p>
            <p><a href="/list">list</a></p>
            <p><a href="/user">user</a></p>
            <p><a href="/subPage/index">subPage/index</a></p>
          </div>
        </div>

        <div className={mainStyle["main-box"]}>
          <Switch>
            {
              routesConfig.map((config) => {
                let path,         // 请求路径
                    resourcePath  // 资源路径
                    ;

                if(typeof config == "object") {
                  path = config.path;
                  resourcePath = config.resourcePath;
                }
                else {
                  path = `/${config}`;
                  resourcePath = config;
                }
                const render = (props) => {
                  // 当前请求路径
                  const currentPathname = this.props.resourcePath;
                  let Child, Mod;
                  // 服务端，直接引入模块
                  if(typeof System == "undefined") {
                    Mod = require(`./pages/${resourcePath}`)["default"];
                    Child = Mod;
                  }
                  // 客户端
                  else {
                    // 如果存在当前请求路径，并且等于当前渲染路径
                    if(currentPathname && currentPathname == resourcePath) {
                      // 当首次载入页面，当前页面对应的组件会通过mod属性传入
                      Mod = this.props.mod;
                      // 在开发模式时，mod属性为空。直接调用懒加载组件
                      if(!Mod) {
                        Mod = LazyLoad;
                      }
                      Child = Mod;
                    }
                    else {
                      Child = LazyLoad;
                    }
                  }
                  props = extend({}, this.props, props);
                  if(Child != LazyLoad) {
                    return (
                      <ModCssWrap resourcePath={resourcePath}>
                        <Child {...props} resourcePath={resourcePath} />
                      </ModCssWrap>
                    );
                  }
                  else {
                    return <Child {...props} resourcePath={resourcePath} />;
                  }
                };
                return <Route path={path} component={render} key={path} />
              })
            }
          </Switch>
        </div>
      </div>
    )
  }
}
