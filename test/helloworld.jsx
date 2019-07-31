import React, { PropTypes } from 'react';

const something = () => {
  return (<div>hello world</div>);
};

something.propTypes = {
  abc: React.PropTypes.func(),
  bde: PropTypes.func(),
};
