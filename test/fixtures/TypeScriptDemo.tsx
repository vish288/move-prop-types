import React, { FC, useState } from 'react';

import PropTypes from 'prop-types';
interface MyComponentProps {
  title: string;
  count?: number;
  onClick: (id: number) => void;
}

const MyComponent: FC<MyComponentProps> = ({ title, count = 0, onClick }) => {
  const [localCount, setLocalCount] = useState(count);

  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {localCount}</p>
      <button onClick={() => onClick(localCount)}>
        Click me
      </button>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired
};

export default MyComponent;