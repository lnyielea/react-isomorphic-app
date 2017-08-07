import React from 'react'
import Base from './base/base'
const style = require('./index.less');

export default class Index extends Base {
  render() {
    return <div className={style.index}>index1</div>
  }
}
