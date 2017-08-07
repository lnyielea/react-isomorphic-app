import React, {Component, PropTypes} from 'react'

class Base extends Component {
}
Base.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  mod: PropTypes.object,
  resourcePath: PropTypes.string
}
export default Base
