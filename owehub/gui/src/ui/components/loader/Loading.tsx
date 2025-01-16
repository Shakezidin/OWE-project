import React from 'react';
import './loading.css';
import { MutatingDots } from 'react-loader-spinner';

const Loading = () => {
  return (
    <div className="transparent-model-loading">
      <MutatingDots
        height="100"
        width="100"
        color="#377cf6"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loading;
