import { Collapse } from 'antd';
import { useEffect, useState } from 'react';
import { RiFilter3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_LINK } from 'shared/const';

import './chat-bar.scss';
import { isEmpty } from 'lodash';
import { NavLink } from 'react-router-dom';

// English.
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { MessageModel } from 'shared/model';
import { getAvatarColor, getAvatarText, getNameChanel } from 'shared/calculator';

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

const { Panel } = Collapse;

function ChatBar({ messageStore }: any) {
  const [isFilter, setIsFilter] = useState(false);
  const [conversation, setConversation] = useState([] as any);
  const [currentUser, setCurrentUser] = useState({} as any);
  const [lastMessage, setLastMessage] = useState<MessageModel>({});

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {
        setCurrentUser(decoded);

        const conversationUrl = `${API_LINK}/conversation/${decoded._id}`;
        const conversationResult = await axios.get(conversationUrl);

        const { data } = conversationResult || {};
        const { conversation } = data || {};

        if (conversation) {
          setConversation(conversation);
        }
      }
    });

    return () => { }
  }, [])

  useEffect(() => {
    setLastMessage(messageStore);

    return () => { }
  }, [messageStore])

  function changeFilter() {
    setIsFilter(!isFilter);
  }

  function getRenderLastMessage(message: MessageModel) {
    const messages = message.messages || [];
    if (!isEmpty(message)) {
      const text = messages[messages.length - 1];
      const isImage = text.includes('data:image');

      return (
        message.sender?._id === currentUser._id
        ? <div className="item-wrap">
          <span className="text-owner">You:</span> 
          <div className="item-review" dangerouslySetInnerHTML={{ __html: `${isImage ? 'Images...' : text}` }} />
        </div>
        : <div className="item-wrap">
          <div className="item-review" dangerouslySetInnerHTML={{ __html: `${isImage ? 'Images...' : text}` }} />
        </div>
      )
    }

    return '';
  }

  return (
    <div className="chat-bar">
      <div className="chat-bar-header">
        {
          isFilter
            ? <div className="bar-header-filter">
              <div className="header-left">
                <input className="header-filter" type="text" placeholder="Filter by name" />
              </div>
              <div className="header-right">
                <span onClick={changeFilter} className="header-icon">
                  <IoMdClose />
                </span>
              </div>
            </div>
            : <div className="bar-header-title">
              <div className="header-left">Chat</div>
              <div className="header-right">
                <span onClick={changeFilter} className="header-icon">
                  <RiFilter3Line />
                </span>
              </div>
            </div>
        }
      </div>

      <div className="chat-bar-content">
        <Collapse bordered={false} accordion defaultActiveKey={['1']}>
          <Panel header={<div className="ant-collapse-text">Recent</div>} key="1">
            <div className="chat-list">
              {
                !isEmpty(conversation)
                && conversation.map((conversation: any) => {
                  return <NavLink
                    key={conversation._id}
                    to={{
                      pathname: `/conversation/${conversation._id}`,
                      state: { conversation }
                    }}
                    className="chat-list-item"
                  >
                    <span className="item-avatar" style={{backgroundColor: getAvatarColor(conversation.members, currentUser)}}>
                      { getAvatarText(conversation.members, currentUser) }
                    </span>
                    <div className="item-group">
                      <div className="group-title">
                        <span className="item-name">{ conversation && getNameChanel(conversation, currentUser)}</span>
                        <span className="item-timestamp">{timeAgo.format(new Date(conversation.createdAt))}</span>
                      </div>
                      {
                        !isEmpty(lastMessage) && getRenderLastMessage(lastMessage)
                      }
                    </div>
                  </NavLink>
                })
              }
            </div>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}

const mapStateToProps = ({ messageStore }: any) => {
  return {
    messageStore: messageStore.message,
  }
}

export default connect(mapStateToProps, null)(ChatBar);
