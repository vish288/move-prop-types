import React, { Component } from 'react';

import PropTypes from 'prop-types';
class TestComponent extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

TestComponent.propTypes = {
  name: PropTypes.string.isRequired
};

export default TestComponent;