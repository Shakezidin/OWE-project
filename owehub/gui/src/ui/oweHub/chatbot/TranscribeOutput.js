import React from 'react';

const TranscribeOutput = ({ transcribedText, interimTranscribedText }) => {
  if (transcribedText.length === 0 && interimTranscribedText.length === 0) {
    return <div variant="body1">...</div>;
  }

  return (
    <div>
      <div variant="body1">{transcribedText}</div>
      <div variant="body1">{interimTranscribedText}</div>
    </div>
  );
};

export default TranscribeOutput;
