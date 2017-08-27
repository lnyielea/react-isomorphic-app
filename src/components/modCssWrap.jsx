/**
 * @author lnyi <lnyielea@gmail.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

let fileMap;

if (typeof client === 'undefined') {
  /**
   * if block require for avoid webpack loop compile
   */
  /* eslint-disable global-require */
  fileMap = require('../static/fileMap.json');
  /* eslint-enabled global-require */
}
/* global _fileMap */
export default class ModCssWrap extends Component {
  render() {
    const resourcePath = this.props.resourcePath;

    let resources;
    /**
     * client from webpack definePlugin
     */
    if (typeof client === 'undefined') {
      resources = fileMap[`/src/pages/${resourcePath}.jsx`];
    } else {
      resources = _fileMap[`/src/pages/${resourcePath}.jsx`];
    }
    if (resources) {
      return (
        <div>
          {
            resources.map(
              (file, i) => {
                if (/\.css$/.test(file)) {
                  const key = `${resourcePath}css${i}`;
                  return <link rel="stylesheet" href={`/dist/${file}`} key={key} />;
                }
                return null;
              }
            )
          }
          {this.props.children}
        </div>
      );
    }
    return this.props.children;
  }
}
ModCssWrap.propTypes = {
  resourcePath: PropTypes.string.isRequired
};
