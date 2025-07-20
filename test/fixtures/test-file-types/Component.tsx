import React, { FC } from 'react';

import PropTypes from 'prop-types';
interface ComponentProps {
  message: string;
  isVisible?: boolean;
}

const FunctionalComponent: FC<ComponentProps> = ({ message, isVisible = true }) => {
  if (!isVisible) return null;
  
  return (
    <div className="component">
      <p>{message}</p>
    </div>
  );
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool
};

export default FunctionalComponent;