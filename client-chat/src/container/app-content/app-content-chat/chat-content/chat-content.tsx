import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { AiOutlineSend, AiOutlineTool } from "react-icons/ai";
import { connect } from 'react-redux';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import 'react-quill/dist/quill.snow.css';
import './chat-content.scss';
import { API_LINK } from 'shared/const';
import { isEmpty } from 'lodash';

// English.
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

function ChatContent({ location, socket }: any) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([] as any);
  const [arrivalMessage, setArrivalMessage] = useState({} as any);
  const [owner, setOwner] = useState({} as any);
  const [modules, setModules] = useState({ toolbar: false });
  const { conversation } = location.state;

  const reactQuillRef = useRef();

  // listen to arrival message
  useEffect(() => {
    socket.on('client-get-message', (message: any) => {
      setArrivalMessage(message);
    })

    return () => {}
  }, []);

  // update arrival message to messsages
  useEffect(() => {
    if(!isEmpty(arrivalMessage) && owner._id !== arrivalMessage.sender._id) {
      setMessages((prev: any) => [...prev, arrivalMessage]);
    }

    return () => {}
  }, [arrivalMessage]);

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {

        // emit leave-room currently
        socket.emit('leave-room');

        // emit join-room flat
        socket.emit('join-room', { conversationId: conversation._id, userId: decoded._id });

        setOwner(decoded);

        const messagesUrl = `${API_LINK}/messages/${conversation._id}`;
        const messageResult = await axios.get(messagesUrl);

        const { data } = messageResult || {};
        const { messages } = data || {};

        if (messages) {
          const groupMessageByTime = groupMessage(messages); // time = 1 minute
          setMessages(groupMessageByTime);
        }
      }
    });

    return () => {}
  }, [conversation._id]);

  async function handleChange(value: any) {
    setText(value);
  }

  function isEditor(value: any) {
    const toolbar = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          ['image'],
          ['close']
        ],
        handlers: {
          close: () => closeFunction()
        }
      } as any
    }

    setModules(toolbar);
  }

  function closeFunction() {
    const toolbar = {
      toolbar: false
    }
    setModules(toolbar);
  }

  const icons = Quill.import('ui/icons');
  icons["close"] = 'close';


  function sendMessage() {
    const token = window.sessionStorage.getItem('token');

    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {
        const messageUrl = `${API_LINK}/messages`;
        const messageResult = await axios.post(messageUrl, { message: { conversationId: conversation._id, senderId: decoded._id, text: text } });

        const { data } = messageResult || {};
        const { status } = data || {};

        if (status === 'success') {
          const time = new Date();
          time.setSeconds(0);
          time.setMilliseconds(0);
          const createdAtMinutes = time.getTime();

          const message = {
            conversationId: conversation._id,
            createdAt: new Date().getTime(),
            createdAtRound: createdAtMinutes,
            messages: [text],
            sender: {
              user_avatar: owner.user_avatar,
              user_name: owner.user_name,
              _id: owner._id,
            }
          }

          const messagesTemp = messages;
 
          if (
            !isEmpty(messagesTemp) 
            && messagesTemp[messages.length - 1].createdAtRound === createdAtMinutes
            && messagesTemp[messages.length - 1].sender._id === owner._id
          ) { // push message into conversation with [0, 1 minute];
            messagesTemp[messages.length - 1].messages.push(text);
            setText('');
            setMessages(messagesTemp);
          } else {
            messagesTemp.push(message);
            setText('');
            setMessages(messagesTemp);
          }

          socket.emit('client-send-message', message);
        }
      }
    }
    )
  }

  function getNameConversation(conversation: any) {
    const { members } = conversation;
    switch (members.length) {
      case 1:
        return members[0].user_name;
      case 2:
        return members[1].user_name;
      default:
        return ''
    }
  }

  function groupMessage(messages: any[]) {
    const groupMessageByTime = [] as any; // time = 1 minute

    messages.forEach((message: any) => {

      // reset seconds and milliseconds to 0 and then getTime
      const time = new Date(message.createdAt);
      time.setSeconds(0);
      time.setMilliseconds(0);
      const createdAtMinutes = time.getTime();

      // Try to get existing message group
      const currentGroup = groupMessageByTime.filter(
        (msgGrp: any) => msgGrp.createdAtRound === createdAtMinutes && message.sender._id === msgGrp.sender._id
      );

      // If we've got the existing group, add the message, otherwise create a new group
      if (currentGroup.length) {
        // currentGroup[0].texts.push(message);
        currentGroup[0].messages.push(message.text);
      } else {
        groupMessageByTime.push({
          conversationId: message.conversationId,
          sender: message.sender,
          // texts: [message], 
          messages: [message.text],
          createdAtRound: createdAtMinutes,
          createdAt: message.createdAt
        });
      }
    });

    return groupMessageByTime || [];
  }

  return (
    <div className="chat-content">
      <div className="chat-content-header">
        <div className="person-card">
          <span className="card-avatar"></span>
          <span className="cartd-title">{conversation && getNameConversation(conversation)}</span>
        </div>
        <div className="header-tabs-bar-wrapper">
          <ul className="tabs-bar-list">
            <li className="tabs-bar-item active">
              <a href="/">Chat</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="chat-content-message">
        <div className="message-content-container">
          <div className="message-content">
            {
              !isEmpty(messages) && !isEmpty(owner)
              && messages.map((message: any) => {
                if (message.sender._id === owner._id) {
                  return (
                    <div key={message.createdAt} className="owner-message">
                      <div className="message-body">
                        <div className="message-body-title">
                          <span className="message-timestamp">{timeAgo.format(new Date(message.createdAtRound))}</span>
                          <div className="message-emoji"></div>
                          <div className="message-first" dangerouslySetInnerHTML={{ __html: message.messages[0] }}></div>
                        </div>
                        <div className="message-body-content"
                          dangerouslySetInnerHTML={{ __html: message.messages.slice(1, message.messages.length).join('') }}>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={message.createdAt} className="customer-message">
                      <div className="message-avatar"></div>
                      <div className="message-body">
                        <div className="message-body-title">
                          <span className="message-name">{message.sender.user_name}</span>
                          <span className="message-timestamp">{timeAgo.format(new Date(message.createdAt))}</span>
                          <div className="message-emoji"></div>
                          <div className="message-first" dangerouslySetInnerHTML={{ __html: message.messages[0] }}></div>
                        </div>
                        <div className="message-body-content"
                          dangerouslySetInnerHTML={{ __html: message.messages.slice(1, message.messages.length).join('') }}>
                        </div>
                      </div>
                    </div>
                  )
                }
              })
            }

          </div>
        </div>
        <div className="message-new">
          <ReactQuill
            ref={reactQuillRef as any}
            theme="snow"
            modules={modules}
            value={text}
            onChange={handleChange}
          />
          <div className="extension-icon">
            <div>
              <span className="sub-icons" onClick={isEditor}><AiOutlineTool /></span>
            </div>

            <span onClick={sendMessage} className="sub-icons"><AiOutlineSend /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ conversationStore, socketStore }: any) => {
  return {
    conversation: conversationStore.conversation,
    socket: socketStore.socket
  }
}

export default connect(mapStateToProps, null)(ChatContent);
