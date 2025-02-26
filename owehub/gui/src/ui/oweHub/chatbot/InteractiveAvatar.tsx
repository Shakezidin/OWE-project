import React from 'react'

const InteractiveAvatar = () => {
  return (
    <div>InteractiveAvatar</div>
  )
}

export default InteractiveAvatar
// import React from 'react';
// import StreamingAvatar, {
//   AvatarQuality,
//   StreamingEvents,
//   TaskMode,
//   TaskType,
//   VoiceEmotion,
// } from '@heygen/streaming-avatar';

// import { useEffect, useRef, useState } from 'react';

// // import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";

// export default function InteractiveAvatar({ speak }: any) {
//   const [isLoadingSession, setIsLoadingSession] = useState(false);
//   const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
//   const [stream, setStream] = useState();

//   const mediaStream = useRef<any>(null);

//   async function fetchAccessToken() {
//     try {
//       const response = await fetch(
//         'https://api.heygen.com/v1/streaming.create_token',
//         {
//           method: 'POST',
//           headers: {
//             'x-api-key':
//               'M2ZjNWViNGE0ZTc2NGI0YThhNjMyOTE3ZjIyZGQ2YzEtMTc0MDMwNjEwMw==',
//           },
//         }
//       );
//       const data = await response.json();
//       console.log('TOKEN', data.data.token);

//       return data.data.token;
//     } catch (error) {
//       console.error('Error fetching access token:', error);
//     }

//     return '';
//   }

//   let currentAvatar: any;
//   async function startSession() {
//     setIsLoadingSession(true);
//     const newToken = await fetchAccessToken();

//     currentAvatar = new StreamingAvatar({
//       token: newToken,
//     });
//     currentAvatar.on(StreamingEvents.AVATAR_START_TALKING, (e: any) => {
//       console.log('Avatar started talking', e);
//     });
//     currentAvatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e: any) => {
//       console.log('Avatar stopped talking', e);
//     });
//     currentAvatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
//       console.log('Stream disconnected');
//       endSession();
//     });
//     currentAvatar.on(StreamingEvents.STREAM_READY, (event: any) => {
//       console.log('>>>>> Stream ready:', event.detail);
//       setStream(event.detail);
//     });
//     currentAvatar.on(StreamingEvents.USER_START, (event: any) => {
//       console.log('>>>>> User started talking:', event);
//     });
//     currentAvatar.on(StreamingEvents.USER_STOP, (event: any) => {
//       console.log('>>>>> User stopped talking:', event);
//     });
//     try {
//       await currentAvatar.createStartAvatar({
//         quality: AvatarQuality.Low,
//         avatarName: 'Anna_public_3_20240108',
//         voice: {
//           rate: 1,
//           emotion: VoiceEmotion.EXCITED,
//         },
//         language: 'en',
//         disableIdleTimeout: true,
//       });
//     } catch (error) {
//       console.error('Error starting avatar session:', error);
//     } finally {
//       setIsLoadingSession(false);
//     }
//   }

//   useEffect(() => {
//     async function handleSpeak(speak: any) {
//       setIsLoadingRepeat(true);
//       if (!currentAvatar) {
//         return;
//       }
//       // speak({ text: text, task_type: TaskType.REPEAT })
//       await currentAvatar.speak({
//         text: speak,
//         taskType: TaskType.REPEAT,
//         taskMode: TaskMode.SYNC,
//       });

//       setIsLoadingRepeat(false);
//     }

//     if (speak && speak.trim()) {
//       handleSpeak(speak);
//     }
//   }, [speak]);

//   async function handleInterrupt() {
//     if (!currentAvatar) {
//       return;
//     }
//     await currentAvatar.interrupt();
//   }
//   async function endSession() {
//     await currentAvatar?.stopAvatar();
//     setStream(undefined);
//   }

//   useEffect(() => {
//     return () => {
//       endSession();
//     };
//   }, []);

//   useEffect(() => {
//     if (stream && mediaStream.current) {
//       mediaStream.current.srcObject = stream;
//       mediaStream.current.onloadedmetadata = () => {
//         mediaStream?.current?.play();
//       };
//     }
//   }, [mediaStream, stream]);

//   return (
//     <div className="w-full flex flex-col gap-4">
//       <div>
//         {isLoadingRepeat ? 'Speaking' : ''}
//         <div className="h-[500px] flex flex-col justify-center items-center">
//           {stream ? (
//             <div className="h-[500px] w-[900px] justify-center items-center flex rounded-lg overflow-hidden">
//               <video
//                 ref={mediaStream}
//                 autoPlay
//                 playsInline
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'contain',
//                 }}
//               >
//                 <track kind="captions" />
//               </video>
//               <div className="flex flex-col gap-2 bottom-3 right-3">
//                 <button onClick={handleInterrupt}>Interrupt task</button>
//                 <button onClick={endSession}>End session</button>
//               </div>
//             </div>
//           ) : !isLoadingSession ? (
//             <div style={{ margin: 20 }}>
//               <button onClick={startSession}>Start session</button>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }
