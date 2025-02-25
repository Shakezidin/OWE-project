const socket = new WebSocket('ws://155.138.163.236:8000/bot/ws/transcribe/');

function socketSend(data) {
  socket.send(JSON.stringify(data));
}
setTimeout(() => {
  socketSend({
    event: 'set_agent',
    data: 'DOC_QA',
  });
}, 3000);

// Stream Audio
let bufferSize = 2048,
  AudioContext,
  context,
  processor,
  input,
  globalStream;

const mediaConstraints = {
  audio: true,
  video: false,
};

let AudioStreamer = {
  /**
   * @param {object} transcribeConfig Transcription configuration such as language, encoding, etc.
   * @param {function} onData Callback to run on data each time it's received
   * @param {function} onError Callback to run on an error if one is emitted.
   */
  initRecording: function (transcribeConfig, onData, onLLMData, onError) {
    socketSend({ event: 'startGoogleCloudStream', data: transcribeConfig });
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();

    const handleSuccess = function (stream) {
      globalStream = stream;
      input = context.createMediaStreamSource(stream);
      input.connect(processor);

      processor.onaudioprocess = function (e) {
        microphoneProcess(e);
      };
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(handleSuccess);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === 'speechData') {
          onData(message.data, message.isFinal);
        } else if (message.event === 'llm_response') {
          onLLMData(message.data);
        } else if (message.event === 'endGoogleCloudStream') {
          closeAll();
        } else if (message.event === 'googleCloudStreamError') {
          onError(message.error || 'An error occurred');
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };
  },

  stopRecording: function () {
    socketSend({ event: 'endGoogleCloudStream' });
    closeAll();
  },
};

export default AudioStreamer;

// Helper functions
/**
 * Processes microphone data into a data stream
 *
 * @param {object} e Input from the microphone
 */
function microphoneProcess(e) {
  const left = e.inputBuffer.getChannelData(0);
  const left16 = convertFloat32ToInt16(left);
  socket.send(left16);
}

/**
 * Converts a buffer from float32 to int16. Necessary for streaming.
 * sampleRateHertz of 1600.
 *
 * @param {object} buffer Buffer being converted
 */
function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  let buf = new Int16Array(l / 3);

  while (l--) {
    if (l % 3 === 0) {
      buf[l / 3] = buffer[l] * 0xffff;
    }
  }
  return buf.buffer;
}

/**
 * Stops recording and closes everything down. Runs on error or on stop.
 */
function closeAll() {
  // Clear the listeners (prevents issue if opening and closing repeatedly)
  // socket.off("speechData");
  // socket.off("googleCloudStreamError");
  let tracks = globalStream ? globalStream.getTracks() : null;
  let track = tracks ? tracks[0] : null;
  if (track) {
    track.stop();
  }

  if (processor) {
    if (input) {
      try {
        input.disconnect(processor);
      } catch (error) {
        console.warn('Attempt to disconnect input failed.');
      }
    }
    processor.disconnect(context.destination);
  }
  if (context) {
    context.close().then(function () {
      input = null;
      processor = null;
      context = null;
      AudioContext = null;
    });
  }
}
