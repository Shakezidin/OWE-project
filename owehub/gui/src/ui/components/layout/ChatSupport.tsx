import React, { useEffect, useState } from 'react';
import {
  Widget,
  addResponseMessage,
  addLinkSnippet,
  toggleInputDisabled,
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');
const ChatSupport = () => {
  const [channelName, setChannelName] = useState(null);
  const [issueType, setIssueType] = useState(null);
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('email');
  useEffect(() => {
    socket.on('success', (event) => {
      console.log(event);
      if (event) {
        const { data, event_name, message } = event;
        if (event_name === 'start-chat') {
          setChannelName(data.channelName);
        }
        if (event_name === 'new_message') {
          addResponseMessage(message);
        }
        if (event_name === 'channel_deleted') {
          addResponseMessage(
            'Channel is deleted, Please restart the window for further discussion'
          );
          toggleInputDisabled();
        }
      }
    });
    socket.on('error', (data) => {
      alert(JSON.stringify(data));
    });
    addResponseMessage(`Hi, How can i help you!
        Please choose issue type:
        1. Dealer Issue
        2. Sales Issue
        `);
  }, []);

  const handleNewUserMessage = (newMessage: any) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
    // addResponseMessage();
    if (!issueType) {
      if (['1', '2'].includes(newMessage)) {
        setIssueType(newMessage);
        addResponseMessage('Thanks, now please tell us the issue?');
      } else {
        addResponseMessage('Please select a correct option, 1 or 2');
      }
      return;
    }

    if (!channelName) {
      socket.emit('start-chat', {
        name,
        email,
        message: newMessage,
        issueType: issueType === '1' ? 'DEALER' : 'SALES',
      });
    } else {
      socket.emit('send-message', {
        channelName,
        message: newMessage,
      });
    }
  };
  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="OWE HUB"
      subtitle="Chat support"
    />
  );
};
export default ChatSupport;

// import React, { useEffect, useState } from 'react';
// import {
//   Widget,
//   addResponseMessage,
//   renderCustomComponent,
// } from 'react-chat-widget';
// import 'react-chat-widget/lib/styles.css';

// // Custom button component
// const ButtonSelection = ({ options, onSelect }: any) => (
//   <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
//     {options.map((option: any, index: any) => (
//       <button
//         key={index}
//         onClick={() => onSelect(option)}
//         style={{
//           margin: '5px 0',
//           padding: '10px',
//           border: 'none',
//           borderRadius: '5px',
//           backgroundColor: '#007bff',
//           color: '#fff',
//           cursor: 'pointer',
//         }}
//       >
//         {option.label}
//       </button>
//     ))}
//   </div>
// );

// const ChatSupport = () => {
//   const handleNewUserMessage = (newMessage: any) => {
//     console.log(`New message incoming! ${newMessage}`);
//   };

//   const handleSelectOption = (option: any) => {

//     addResponseMessage(`You selected: ${option.label}`);

//   };

//   const handleShowOptions = () => {
//     addResponseMessage('Hi, How can I help you?');
//     addResponseMessage('Please choose type of issue you are facing:');
//     renderCustomComponent(ButtonSelection, {
//       options: [{ label: 'Sales Issue' }, { label: 'Dealer Issue' }],
//       onSelect: handleSelectOption,
//     });
//   };

//   useEffect(() => {
//     handleShowOptions();
//   }, []);

//   return (
//     <div className="App">
//       <Widget
//         handleNewUserMessage={handleNewUserMessage}
//         title="Owe Support"
//         subtitle="Chat with us"
//       />
//     </div>
//   );
// };

// export default ChatSupport;
