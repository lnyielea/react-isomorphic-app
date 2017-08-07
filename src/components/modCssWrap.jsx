/**
 * 加载模块对应的css文件
 * @author lnyi <lnyielea@gmail.com>
 */

import React, {Component} from 'react'

export default class ModCssWrap extends Component {
  render() {
    const resourcePath = this.props.resourcePath;

    let resources;
    /**
     * 根据是否客户端选择fileMap的加载方式
     */
    if(typeof client == "undefined") {
      resources = require("../../build/static/fileMap")[`/src/pages/${resourcePath}.jsx`]
    }
    else {
      resources = _fileMap[`/src/pages/${resourcePath}.jsx`]
    }
    if(resources) {
      return (
        <div>
          {
            resources.map((file, i) => {
              if(/\.css$/.test(file)) {
                return <link rel="stylesheet" href={`/dist/${file}`} key={`${resourcePath}css${i}`} />;
              }
            })
          }
          {this.props.children}
        </div>
      );
    }
    else {
      return this.props.children;
    }
  }
}
