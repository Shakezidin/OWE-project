import React, { useEffect, useRef, useState } from 'react';
// import {
//   Widget,
//   addResponseMessage,
//   addLinkSnippet,
//   toggleInputDisabled,
//   renderCustomComponent,
// } from 'react-chat-widget';
// import 'react-chat-widget/lib/styles.css';
import { io } from 'socket.io-client';

import botOpen from '../../../resources/assets/botOpen.png';
import botOpenUp from '../../../resources/assets/botOpenUp.png';
import send from '../../../resources/assets/send.png';
import sendActive from '../../../resources/assets/send-active.png';
import chat_logo from '../../../resources/assets/chat_logo.png';
import need from '../../../resources/assets/need.png';
import { ReactComponent as CrossIcon } from '../../../resources/assets/cross-w.svg';
import { ReactComponent as RefreshIcon } from '../../../resources/assets/refresh.svg';
import moment from 'moment';

const socket = io('https://staging.owe-hub.com');
const ChatSupport = () => {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setChatOpen] = useState(false);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    console.log(messagesEndRef.current);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    console.log('NEW MESSAE');
    scrollToBottom(); // Scroll to bottom when the component mounts
  }, [messages]); // Empty dependency array means it runs only once on mount

  function addResponseMessage(message: string) {
    setMessages((messages: any) => [
      ...messages,
      { message, client: false, time: moment().format('DD MMM, hh:mm a') },
    ]);
  }

  function addUserMessage(message: string) {
    setMessages((messages: any) => [
      ...messages,
      { message, client: true, time: moment().format('DD MMM, hh:mm a') },
    ]);
  }
  //
  const [channelName, setChannelName] = useState(null);
  const [issueType, setIssueType] = useState<any>(null);
  const [projectId, setProjectId] = useState<any>(null);
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('email');
  useEffect(() => {
    setTimeout(() => {
      document.getElementById('need-assistace')?.classList.add('hide');
    }, 3000);
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
        }
      }
    });
    socket.on('error', (data) => {
      alert(JSON.stringify(data));
    });
  }, []);

  const handleNewUserMessage = (newMessage: any) => {
    let project_id = 'Technical Support';
    if (!projectId && issueType !== 'Technical Support') {
      if (!newMessage.startsWith('OUR')) {
        return addResponseMessage('Plese enter valid Project ID');
      } else {
        project_id = newMessage.trim();
        setProjectId(project_id);
        addResponseMessage(
          'Thanks, Please wait a while, we will connect you...'
        );
      }
    }
    if (!channelName) {
      socket.emit('start-chat', {
        name,
        email,
        message: newMessage,
        issueType,
        project_id,
      });
    } else {
      socket.emit('send-message', {
        channelName,
        message: newMessage,
      });
    }
  };

  useEffect(() => {
    if (issueType) {
      addUserMessage(issueType);
      if (issueType === 'Technical Support') {
        addResponseMessage('How can I help you?');
      } else {
        addResponseMessage('Please provide project ID');
      }
    }
  }, [issueType]);
  // return (
  //   <Widget
  //     handleNewUserMessage={handleNewUserMessage}
  //     title="OWE HUB"
  //     subtitle="Chat support"
  //   />
  // );

  function handleSend() {
    addUserMessage(newMessage);
    handleNewUserMessage(newMessage);
    setNewMessage('');
  }

  function handleChatHide() {
    setChatOpen(!isChatOpen);
    document
      .getElementById('rcw-conversation-container')
      ?.classList.toggle('hide');
    document.getElementById('need-assistace')?.classList.add('hide');
  }
  function handleRefresh() {
    setMessages([]);
    setIssueType(null);
    setChannelName(null);
  }

  const style: any = { position: 'absolute', width: '100%', height: '100%' };
  return (
    <div style={isChatOpen ? style : {}} onClick={handleChatHide}>
      <div
        className="rcw-widget-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="rcw-conversation-container"
          className="rcw-conversation-container active hide"
          aria-live="polite"
        >
          <div className="rcw-header">
            <div className="header-logo-title">
              <div className="online-container">
                <img src={chat_logo} alt="Open chat" />
                <div className="online-dot" />
              </div>
              <h4 className="rcw-title">
                OWE {issueType?.toUpperCase() || 'BOT'} ASSISTANT
              </h4>
            </div>
            <div className="bot-icons">
              <div className="popconfirm-container">
                {issueType ? (
                  <RefreshIcon
                    id="trigger-btn"
                    onClick={() =>
                      document
                        .getElementById('popconfirm')
                        ?.classList.toggle('hidden')
                    }
                    height={18}
                    width={18}
                    style={{ marginTop: 3, cursor: 'pointer' }}
                  />
                ) : null}
                <div id="popconfirm" className="popconfirm hidden">
                  <p>Are you sure you want refresh?</p>
                  <p style={{ marginTop: -10 }}>Chat history will be lost.</p>
                  <button
                    className="no-btn"
                    onClick={() =>
                      document
                        .getElementById('popconfirm')
                        ?.classList.toggle('hidden')
                    }
                  >
                    No
                  </button>
                  <button
                    className="confirm"
                    onClick={() => {
                      handleRefresh();
                      document
                        .getElementById('popconfirm')
                        ?.classList.toggle('hidden');
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>

              <div style={{ cursor: 'pointer' }} onClick={handleChatHide}>
                <CrossIcon height={16} width={16} />
              </div>
            </div>
          </div>

          <div id="messages" className="rcw-messages-container">
            {!issueType ? (
              <div className="greeting-container">
                <div className="greeting">
                  <h3>Hello, {name}</h3>
                  <h4>How can i assist you today?</h4>
                </div>
                <h4 className="choose-option">
                  Please select one of the following options:
                </h4>
                <div className="rcs-options-container">
                  <div
                    className="rcs-option-container"
                    onClick={() => setIssueType('Project Support')}
                  >
                    <h5>Project Support</h5>
                    <h6>
                      If you need assistance related to specific projects and
                      its status
                    </h6>
                  </div>

                  <div
                    style={{ pointerEvents: 'none', background: '#aaa' }}
                    className="rcs-option-container"
                    onClick={() => setIssueType('Commission Support')}
                  >
                    <h5>Commission Support</h5>
                    <h6>
                      Coming Soon
                      {/* If you need assistance related to specific projects and its
                    status */}
                    </h6>
                  </div>

                  <div
                    className="rcs-option-container"
                    onClick={() => setIssueType('Technical Support')}
                  >
                    <h5>IT Support</h5>
                    <h6>
                      If you need assistance realated to Information Technology
                    </h6>
                  </div>
                </div>
              </div>
            ) : null}

            {issueType ? (
              <>
                {messages.map(({ client, message, time }: any) => {
                  if (client) {
                    return (
                      <div className="rcw-message rcw-message-client">
                        <div className="avatar">{name && name[0]}</div>
                        <div className="rcw-client">
                          <div className="rcw-message-text">
                            <p>{message}</p>
                          </div>
                          <span className="rcw-timestamp">{time}</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="rcw-message ">
                      <img
                        src={chat_logo}
                        alt="Open chat"
                        className="avatar avatar-2"
                      />
                      <div className="rcw-response">
                        <div className="rcw-message-text">
                          <p>{message}</p>
                        </div>
                        <span className="rcw-timestamp">{time}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : null}
            {/* <div className="loader">
            <div className="loader-container">
              <span className="loader-dots"></span>
              <span className="loader-dots"></span>
              <span className="loader-dots"></span>
            </div>
          </div> */}
            <div ref={messagesEndRef} />
          </div>
          <div className="rcw-sender">
            <button className="rcw-picker-btn" type="submit">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMmM1LjUxNCAwIDEwIDQuNDg2IDEwIDEwcy00LjQ4NiAxMC0xMCAxMC0xMC00LjQ4Ni0xMC0xMCA0LjQ4Ni0xMCAxMC0xMHptMC0yYy02LjYyNyAwLTEyIDUuMzczLTEyIDEyczUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyLTUuMzczLTEyLTEyLTEyem01LjUwNyAxMy45NDFjLTEuNTEyIDEuMTk1LTMuMTc0IDEuOTMxLTUuNTA2IDEuOTMxLTIuMzM0IDAtMy45OTYtLjczNi01LjUwOC0xLjkzMWwtLjQ5My40OTNjMS4xMjcgMS43MiAzLjIgMy41NjYgNi4wMDEgMy41NjYgMi44IDAgNC44NzItMS44NDYgNS45OTktMy41NjZsLS40OTMtLjQ5M3ptLTkuMDA3LTUuOTQxYy0uODI4IDAtMS41LjY3MS0xLjUgMS41cy42NzIgMS41IDEuNSAxLjUgMS41LS42NzEgMS41LTEuNS0uNjcyLTEuNS0xLjUtMS41em03IDBjLS44MjggMC0xLjUuNjcxLTEuNSAxLjVzLjY3MiAxLjUgMS41IDEuNSAxLjUtLjY3MSAxLjUtMS41LS42NzItMS41LTEuNS0xLjV6Ii8+PC9zdmc+Cg=="
                className="rcw-picker-icon"
                alt=""
              />
            </button>
            <div className="rcw-new-message">
              <input
                className="rcw-input"
                role="textbox"
                value={newMessage}
                disabled={!issueType}
                placeholder="Ask me anything"
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="rcw-send"
              disabled={!newMessage}
              onClick={() => handleSend()}
            >
              <img
                src={newMessage ? sendActive : send}
                className="rcw-send-icon"
                alt="Send"
              />
            </button>
          </div>
        </div>
        <div
          className="rcw-launcher"
          aria-controls="rcw-chat-container"
          onClick={handleChatHide}
        >
          <img
            src={isChatOpen ? botOpenUp : botOpen}
            alt="Open chat"
            className="bot-open"
            onMouseOver={() => {
              document
                .getElementById('need-assistace')
                ?.classList.remove('hide');
            }}
            onMouseLeave={() => {
              document.getElementById('need-assistace')?.classList.add('hide');
            }}
          />
          <img
            src={need}
            id="need-assistace"
            alt="Need assitance"
            className="need-assistace"
            onClick={(e) => {
              e.stopPropagation();
              document
                .getElementById('need-assistace')
                ?.classList.toggle('hide');
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default ChatSupport;
