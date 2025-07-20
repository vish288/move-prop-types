import React from 'react';

import PropTypes from 'prop-types';
const something = () => {
  return (<div>hello world</div>);
};

something.propTypes = {
  abc: PropTypes.func(),
  bde: PropTypes.func() };
