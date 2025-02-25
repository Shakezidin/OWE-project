import React from 'react';

const TranscribeOutput = ({ transcribedText, interimTranscribedText }: any) => {
  if (transcribedText.length === 0 && interimTranscribedText.length === 0) {
    return <div>...</div>;
  }

  return (
    <div>
      <div>{transcribedText}</div>
      <div>{interimTranscribedText}</div>
    </div>
  );
};

export default TranscribeOutput;
