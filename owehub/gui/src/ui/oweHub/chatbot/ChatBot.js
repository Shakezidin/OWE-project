import React, { useState } from 'react';
import speechToTextUtils from './utility_transcribe';
import TranscribeOutput from './TranscribeOutput';
import InteractiveAvatar from './InteractiveAvatar';

const ChatBot = () => {
  const [transcribedData, setTranscribedData] = useState([]);
  const [interimTranscribedData, setInterimTranscribedData] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [speak, setSpeak] = useState('');

  function flushInterimData() {
    if (interimTranscribedData !== '') {
      setInterimTranscribedData('');
      setTranscribedData((oldData) => [...oldData, interimTranscribedData]);
    }
  }

  function handleDataReceived(data, isFinal) {
    if (isFinal) {
      setInterimTranscribedData('');
      setTranscribedData((oldData) => [...oldData, data]);
    } else {
      setInterimTranscribedData(data);
    }
  }

  function getTranscriptionConfig() {
    return {
      audio: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      interimResults: true,
    };
  }

  function handleLLMData(data) {
    setSpeak(data);
    onStop();
  }

  function onStart() {
    setTranscribedData([]);
    setIsRecording(true);

    speechToTextUtils.initRecording(
      getTranscriptionConfig(),
      handleDataReceived,
      handleLLMData,
      (error) => {
        console.error('Error when transcribing', error);
        setIsRecording(false);
        // No further action needed, as stream already closes itself on error
      }
    );
  }

  function onStop() {
    setIsRecording(false);
    flushInterimData(); // A safety net if Google's Speech API doesn't work as expected, i.e. always sends the final result
    speechToTextUtils.stopRecording();
  }

  return (
    <div>
      <InteractiveAvatar speak={speak} />
      <div>
        {!isRecording && (
          <button onClick={onStart} variant="primary">
            Speak
          </button>
        )}
        {isRecording && (
          <button onClick={onStop} variant="danger">
            Stop
          </button>
        )}
      </div>
      Response:
      <h6>{speak}</h6>
      <div>
        <TranscribeOutput
          transcribedText={transcribedData}
          interimTranscribedText={interimTranscribedData}
        />
      </div>
    </div>
  );
};

export default ChatBot;
