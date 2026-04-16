import React from 'react';

const Spinner = ({ size = 'md', center = true }) => {
  const sizeMap = { sm: '1.25rem', md: '2rem', lg: '3rem' };
  const dim = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div
      className="spinner"
      style={{ width: dim, height: dim }}
      role="status"
      aria-label="Loading"
    />
  );

  if (center) {
    return <div className="loading-center">{spinner}</div>;
  }

  return spinner;
};

export default Spinner;
