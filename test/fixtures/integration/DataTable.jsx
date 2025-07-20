import React, { Component } from 'react';

import PropTypes from 'prop-types';
class DataTable extends Component {
  render() {
    // Component implementation
    return <div>Table</div>;
  }
}

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    render: PropTypes.func
  })).isRequired,
  onRowClick: PropTypes.func,
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  loading: PropTypes.bool
};

export default DataTable;