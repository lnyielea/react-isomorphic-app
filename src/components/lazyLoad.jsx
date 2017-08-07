/**
 * 懒加载组件
 * @author lnyi <lnyielea@gmail.com>
 */

import React, {Component, PropTypes} from 'react'
import ModCssWrap from './modCssWrap'

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
    this.module.then((mod) => {
      this.setState({mod:mod["default"] || mod, isLoading: false});
    })
    .catch(() => {
      this.setState({isLoading: false})
    });
  }
  render() {
    const Mod = this.state.mod;
    const resourcePath = this.props.resourcePath;

    if(!this.state.isLoading) {
      const resources = _fileMap[`/src/pages/${resourcePath}.jsx`];
      return (
        <ModCssWrap resourcePath={resourcePath}>
          <Mod {...this.props} />
        </ModCssWrap>
      );
    }
    else {
      return <div>加载中</div>;
    }
  }
}
LazyLoad.propTypes = {
  resourcePath: PropTypes.string.isRequired
}
