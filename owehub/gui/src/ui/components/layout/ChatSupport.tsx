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
import cross from '../../../resources/assets/cross.png';
import refresh from '../../../resources/assets/refresh.png';
import need from '../../../resources/assets/need.png';
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
  }, [newMessage]); // Empty dependency array means it runs only once on mount

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

  return (
    <div className="rcw-widget-container">
      <div
        id="rcw-conversation-container"
        className="rcw-conversation-container active hide"
        aria-live="polite"
      >
        {issueType && (
          <div className="rcw-header">
            <div className="header-logo-title">
              <div className="online-container">
                <img src={chat_logo} alt="Open chat" />
                <div className="online-dot" />
              </div>
              <h4 className="rcw-title">OWE BOT ASSISTANT</h4>
            </div>
            <div className="bot-icons">
              <img src={refresh} alt="close" onClick={handleRefresh} />
              <img src={cross} alt="close" onClick={handleChatHide} />
            </div>
          </div>
        )}

        <div id="messages" className="rcw-messages-container">
          {!issueType ? (
            <div className="greeting-container">
              <div className="greeting">
                <h3>Hello, {name}</h3>
                <h4>How can i assist you today?</h4>
              </div>
              <h4 className="choose-option">
                Choose one of the option from below.
              </h4>
              <div className="rcs-options-container">
                <div
                  className="rcs-option-container"
                  onClick={() => setIssueType('Project Support')}
                >
                  <h5>Project Support</h5>
                  <h6>
                    If you need assistance related to specific projects and its
                    status
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
                  <h5>Technical Support</h5>
                  <h6>
                    If you need assistance related to specific projects and its
                    status
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
        />
        <img
          src={need}
          id="need-assistace"
          alt="Need assitance"
          className="need-assistace"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('need-assistace')?.classList.toggle('hide');
          }}
        />
      </div>
    </div>
  );
};
export default ChatSupport;
