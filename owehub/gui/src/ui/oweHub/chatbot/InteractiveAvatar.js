import React from 'react';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';

import { useEffect, useRef, useState } from 'react';

// import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";

export default function InteractiveAvatar({ speak }) {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState();

  const mediaStream = useRef(null);
  const avatar = useRef(null);

  async function fetchAccessToken() {
    try {
      const response = await fetch(
        'https://api.heygen.com/v1/streaming.create_token',
        {
          method: 'POST',
          headers: {
            'x-api-key':
              'M2ZjNWViNGE0ZTc2NGI0YThhNjMyOTE3ZjIyZGQ2YzEtMTc0MDMwNjEwMw==',
          },
        }
      );
      const data = await response.json();
      console.log('TOKEN', data.data.token);

      return data.data.token;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }

    return '';
  }

  async function startSession() {
    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log('Avatar started talking', e);
    });
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log('Avatar stopped talking', e);
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log('Stream disconnected');
      endSession();
    });
    avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
      console.log('>>>>> Stream ready:', event.detail);
      setStream(event.detail);
    });
    avatar.current.on(StreamingEvents.USER_START, (event) => {
      console.log('>>>>> User started talking:', event);
    });
    avatar.current.on(StreamingEvents.USER_STOP, (event) => {
      console.log('>>>>> User stopped talking:', event);
    });
    try {
      await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: 'Anna_public_3_20240108',
        voice: {
          rate: 1,
          emotion: VoiceEmotion.EXCITED,
        },
        language: 'en',
        disableIdleTimeout: true,
      });
    } catch (error) {
      console.error('Error starting avatar session:', error);
    } finally {
      setIsLoadingSession(false);
    }
  }

  useEffect(() => {
    async function handleSpeak(speak) {
      setIsLoadingRepeat(true);
      if (!avatar.current) {
        return;
      }
      // speak({ text: text, task_type: TaskType.REPEAT })
      await avatar.current
        .speak({
          text: speak,
          taskType: TaskType.REPEAT,
          taskMode: TaskMode.SYNC,
        })
        .catch((e) => {});
      setIsLoadingRepeat(false);
    }

    if (speak && speak.trim()) {
      handleSpeak(speak);
    }
  }, [speak]);

  async function handleInterrupt() {
    if (!avatar.current) {
      return;
    }
    await avatar.current.interrupt().catch((e) => {});
  }
  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current.play();
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        {isLoadingRepeat ? 'Speaking' : ''}
        <div className="h-[500px] flex flex-col justify-center items-center">
          {stream ? (
            <div className="h-[500px] w-[900px] justify-center items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              >
                <track kind="captions" />
              </video>
              <div className="flex flex-col gap-2 absolute bottom-3 right-3">
                <button variant="primary" onClick={handleInterrupt}>
                  Interrupt task
                </button>
                <button variant="primary" onClick={endSession}>
                  End session
                </button>
              </div>
            </div>
          ) : !isLoadingSession ? (
            <div style={{ margin: 20 }}>
              <button variant="primary" onClick={startSession}>
                Start session
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
