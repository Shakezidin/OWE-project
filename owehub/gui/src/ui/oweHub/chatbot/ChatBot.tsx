import React, { useState } from 'react';
import speechToTextUtils from './utility_transcribe';
import TranscribeOutput from './TranscribeOutput';
import InteractiveAvatar from './InteractiveAvatar';

const ChatBot: React.FC = () => {
  const [transcribedData, setTranscribedData] = useState<any>([]);
  const [interimTranscribedData, setInterimTranscribedData] = useState<any>('');
  const [isRecording, setIsRecording] = useState<any>(false);

  const [speak, setSpeak] = useState('');

  function flushInterimData() {
    if (interimTranscribedData !== '') {
      setInterimTranscribedData('');
      setTranscribedData((oldData: any) => [
        ...oldData,
        interimTranscribedData,
      ]);
    }
  }

  function handleDataReceived(data: any, isFinal: any) {
    if (isFinal) {
      setInterimTranscribedData('');
      setTranscribedData((oldData: any) => [...oldData, data]);
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

  function handleLLMData(data: any) {
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
      (error: any) => {
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
        {!isRecording && <button onClick={onStart}>Speak</button>}
        {isRecording && <button onClick={onStop}>Stop</button>}
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
