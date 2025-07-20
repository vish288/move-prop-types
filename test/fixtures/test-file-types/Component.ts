import React, { Component } from 'react';

import PropTypes from 'prop-types';
interface Props {
  title: string;
  count: number;
}

class TypedComponent extends Component<Props> {
  render() {
    return <div>{this.props.title}: {this.props.count}</div>;
  }
}

TypedComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number
};

export default TypedComponent;