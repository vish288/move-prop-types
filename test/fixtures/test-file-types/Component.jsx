import React from 'react';

import PropTypes from 'prop-types';
const TestComponent = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
    </div>
  );
};

TestComponent.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number
};

export default TestComponent;