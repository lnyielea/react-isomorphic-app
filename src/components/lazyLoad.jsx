/**
 * @author lnyi <lnyielea@gmail.com>
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ModCssWrap from './modCssWrap';

export default class LazyLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mod: null,
      isLoading: true
    };
    const resourcePath = this.props.resourcePath;
    this.module = System.import(`../pages/${resourcePath}`);
  }
  componentWillMount() {
    this.module.then(
      (mod) => {
        this.setState({ mod: mod.default || mod, isLoading: false });
      }
    ).catch(
      () => {
        this.setState({ isLoading: false });
      }
    );
  }
  render() {
    const Mod = this.state.mod;
    const resourcePath = this.props.resourcePath;

    if (!this.state.isLoading) {
      return (
        <ModCssWrap resourcePath={resourcePath}>
          <Mod {...this.props} />
        </ModCssWrap>
      );
    }
    return <div>加载中</div>;
  }
}
LazyLoad.propTypes = {
  resourcePath: PropTypes.string.isRequired
};
