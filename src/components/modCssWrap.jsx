/**
 * @author lnyi <lnyielea@gmail.com>
 */

import React, {Component, PropTypes} from 'react'

export default class ModCssWrap extends Component {
  render() {
    const resourcePath = this.props.resourcePath;

    let resources;
    /**
     * client from webpack definePlugin
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
ModCssWrap.propTypes = {
  resourcePath: PropTypes.string.isRequired
}
