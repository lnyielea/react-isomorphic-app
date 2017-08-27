/**
 * @author lnyi <lnyielea@gmail.com>
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

/* eslint-disable */
class Base extends Component {}
Base.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  mod: PropTypes.object,
  resourcePath: PropTypes.string
};
/* eslint-enable */
export default Base;
