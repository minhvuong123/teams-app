import { useEffect, useRef, useState } from 'react';
import { AiOutlineSend, AiOutlineTool } from "react-icons/ai";
import { connect } from 'react-redux';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { MessageModel } from 'shared/model';
import { API_LINK } from 'shared/const';
import { isEmpty } from 'lodash';

import AppTextEditor from 'container/app-text-editor/app-text-editor';
import { groupMessage } from 'shared/calculator';
import Message from './message/message';
import { setMessage } from 'shared/redux/actions';

import './chat-messenger.scss';

function ChatMessenger({ location, socket, setMessageStore  }: any) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState({} as any);
  const [isCloseEditor, setIsCloseEditor] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState({} as any);
  const { conversation } = location.state;

  const scrollRef = useRef<HTMLDivElement>();

  // listen to arrival message
  useEffect(() => {
    let mounted = true;
    socket.on('client-get-message', (message: MessageModel) => {
      if(mounted){ // not update if unmount
        setArrivalMessage(message);
        setMessageStore(message);
      }
    })

    return () => { mounted = false }
  }, [socket]);

  // update arrival message to messsages
  useEffect(() => {
    if (!isEmpty(arrivalMessage) && currentUser._id !== arrivalMessage.sender._id) {

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

    return () => { }
  }, [arrivalMessage, currentUser._id]);

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {
        setCurrentUser(decoded);

        // emit leave-room currently
        socket.emit('leave-room');

        // emit join-room flat
        socket.emit('join-room', { conversationId: conversation._id, userId: decoded._id });

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

    return () => { }
  }, [conversation._id]);

  useEffect(() => {
    !isEmpty(messages) && scrollRef.current?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
      inline: 'center'
    });

    return () => { }
  }, [messages]);


  function sendMessage() {
    const token = window.sessionStorage.getItem('token');

    const parser = new DOMParser();
    const html = parser.parseFromString(text, 'text/html');
    // console.log("html: ", html.body);
    const images = html.getElementsByTagName('img');
    // console.log("images: ", images);
    // console.log("html: ", html.body);

    // console.log("html: ", html.body.innerHTML);

    const populateFiles = Array.from(images).map((image: any) => {
      return {
        id: image.dataset.id || '',
        name: image.dataset.name || '',
        base64: image.getAttribute('src') || '',
        type: image.dataset.type || '',
        size: image.dataset.size || 0,
      }
    });

    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {

        if (!isEmpty(populateFiles)) {
          const fileUrl = `${API_LINK}/files`
          const filesStore = await axios.post(fileUrl, { files: { conversationId: conversation._id, files: populateFiles } });
          const { data } = filesStore || {};
          const { files } = data || {};

          if (files.length > 0) {
            files.forEach((file: any, index: number) => {
              if (!file.status) {
                images[index].src = '';
              }
            });
          }
        }

        const messageUrl = `${API_LINK}/messages`;
        const messageResult = await axios.post(messageUrl, { message: { conversationId: conversation._id, senderId: decoded._id, text: html.body.innerHTML } });

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
              user_firstname: currentUser.user_firstname,
              user_lastname: currentUser.user_lastname,
              user_fullname: currentUser.user_fullname,
              user_background_color: currentUser.user_background_color,
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
    })
  }

  function onChangeEditor(value: string): void {
    setText(value);
  }

  function onClose(value?: boolean): void {
    setIsCloseEditor(value as any);
  }

  function onCloseEditor(): void {
    setIsCloseEditor(!isCloseEditor);
  }

  return (
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
          valueClass=""
          valueTabName="div"
          placeholder="message ..."
          isClose={isCloseEditor}
          onClose={onClose}
          onChange={onChangeEditor}
          value={text}
        />
        <div className="extension-icon">
          <div>
            <span className="sub-icons" onClick={onCloseEditor}><AiOutlineTool /></span>
          </div>
          <span onClick={sendMessage} className="sub-icons"><AiOutlineSend /></span>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessenger);
