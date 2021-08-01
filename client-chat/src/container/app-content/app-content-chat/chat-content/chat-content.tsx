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

import { MessageModel } from 'shared/model';
import { setMessage } from 'shared/redux/actions';
import Message from './message/message';
import { getAvatarColor, getAvatarText, getNameChanel, groupMessage } from 'shared/calculator';
import AppTextEditor from 'container/app-text-editor/app-text-editor';


function ChatContent({ location, socket, setMessageStore }: any) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState({} as any);
  const [currentUser, setCurrentUser] = useState({} as any);
  const [modules, setModules] = useState({ toolbar: false });
  const [isCloseEditor, setIsCloseEditor] = useState<boolean>(true);
  const { conversation } = location.state;

  const reactQuillRef = useRef();
  const scrollRef = useRef<HTMLDivElement>();

  // listen to arrival message
  useEffect(() => {
    socket.on('client-get-message', (message: MessageModel) => {
      setArrivalMessage(message);
      setMessageStore(message);
    })

    return () => {}
  }, [socket, setMessageStore]);

  // update arrival message to messsages
  useEffect(() => {
    if(!isEmpty(arrivalMessage) && currentUser._id !== arrivalMessage.sender._id) {
      
      const messagesTemp = [...messages];
      const msg = arrivalMessage.messages[0];
      const lastMessage = messagesTemp ? messagesTemp[messages.length - 1] : {} as MessageModel;
      const isExistConversation = !isEmpty(messagesTemp) 
                                  && lastMessage.createdAtRound === arrivalMessage.createdAtRound 
                                  && lastMessage.sender?._id === arrivalMessage.sender._id;
      
      if (isExistConversation) { // push message into conversation with [0, 1 minute];
        lastMessage.messages?.push(msg);
      } else {
        messagesTemp.push(arrivalMessage);
      }

      setMessages(messagesTemp);
    }

    return () => {}
  }, [arrivalMessage, currentUser._id]);

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {

        // emit leave-room currently
        socket.emit('leave-room');

        // emit join-room flat
        socket.emit('join-room', { conversationId: conversation._id, userId: decoded._id });

        setCurrentUser(decoded);

        const messagesUrl = `${API_LINK}/messages/${conversation._id}`;
        const messageResult = await axios.get(messagesUrl);

        const { data } = messageResult || {};
        const { messages } = data || {} as MessageModel[];

        if (!isEmpty(messages)) {
          const groupMessageByTime = groupMessage(messages); // time = 1 minute
          setMessageStore(groupMessageByTime[groupMessageByTime.length - 1]);
          setMessages(groupMessageByTime);
        }
      }
    });

    return () => {}
  }, [conversation._id]);
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
      inline: 'center'
    });

    return () => {}
  }, [messages]);

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
        const isImage = text.includes('data:image');
        const startIndex = text.indexOf('data:image');
        const endIndex = text.indexOf('">');
        const base64Text = isImage ? text.substring(startIndex, endIndex) : text;

        const messageUrl = `${API_LINK}/messages`;
        const messageResult = await axios.post(messageUrl, { message: { conversationId: conversation._id, senderId: decoded._id, text: base64Text } });

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
              user_avatar: currentUser.user_avatar,
              user_name: currentUser.user_name,
              _id: currentUser._id,
            }
          } as MessageModel

          const messagesTemp = [...messages];
          const lastMessage = messagesTemp ? messagesTemp[messages.length - 1] : {} as MessageModel;
          const isExistConversation = !isEmpty(messagesTemp) 
                                      && lastMessage.createdAtRound === createdAtMinutes 
                                      && lastMessage.sender?._id === currentUser._id;
 
          if (isExistConversation) { // push message into conversation with [0, 1 minute];
            lastMessage.messages?.push(text);
          } else {
            messagesTemp.push(message);
          }

          setText('');
          setMessages(messagesTemp);

          socket.emit('client-send-message', message);
        }
      }
    }
    )
  }

  function onChangeEditor(value: any): void {
    setText(value);
  }

  function onClose(value?: boolean): void {
    setIsCloseEditor(value as any);
  }

  function onCloseEditor(): void {
    setIsCloseEditor(!isCloseEditor);
  }

  return (
    <div className="chat-content">
      <div className="chat-content-header">
        <div className="person-card">
          <span className="card-avatar" style={{backgroundColor: getAvatarColor(conversation.members, currentUser)}}>
            { getAvatarText(conversation.members, currentUser) }
          </span>
          <span className="cartd-title">{conversation && getNameChanel(conversation, currentUser)}</span>
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
              !isEmpty(messages) && !isEmpty(currentUser)
              && messages.map((message: any) => (
                  <Message key={message.createdAt} message={message} currentUser={currentUser} />
              ))
            }
            <div ref={scrollRef as any}></div>
          </div>
        </div>
        <div className="message-editor">
          <AppTextEditor
            wrapName="editor-wrap" 
            textClass="editor-text" 
            placeholder="message ..."
            isClose={isCloseEditor}
            onClose={onClose}
            onChange={onChangeEditor} 
          />
          <div className="extension-icon">
            <div>
              <span className="sub-icons" onClick={onCloseEditor}><AiOutlineTool /></span>
            </div>
            <span onClick={sendMessage} className="sub-icons"><AiOutlineSend /></span>
          </div>
          {/* <ReactQuill
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
          </div> */}
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    setMessageStore: (message: MessageModel) => dispatch(setMessage(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContent);
