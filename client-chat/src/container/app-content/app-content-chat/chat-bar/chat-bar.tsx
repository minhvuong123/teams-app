import { Collapse } from 'antd';
import { useEffect, useState } from 'react';
import { RiFilter3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { API_LINK } from 'shared/const';

import './chat-bar.scss';
import { isEmpty } from 'lodash';
import { NavLink } from 'react-router-dom';

// English.
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

const { Panel } = Collapse;

function ChatBar() {
  const [isFilter, setIsFilter] = useState(false);
  const [conversation, setConversation] = useState([] as any);
  const [currentUser, setCurrentUser] = useState({} as any);

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

  function changeFilter() {
    setIsFilter(!isFilter);
  }

  function getNameConversation(conversation: any) {
    const { members } = conversation;
    switch(members.length) {
      case 1: 
        return members[0].user_name;
      case 2:
        const friend = members.filter((member: any) => member._id !== currentUser._id);
        return friend[0].user_name;
      default: 
        return '' 
    }
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
                            <span className="item-avatar"></span>
                            <div className="item-group">
                              <div className="group-title">
                                <span className="item-name">{getNameConversation(conversation)}</span>
                                <span className="item-timestamp">{timeAgo.format(new Date(conversation.createdAt))}</span>
                              </div>
                              <span className="item-preview">message chat</span>
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

export default ChatBar;
