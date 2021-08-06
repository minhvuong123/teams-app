import { useEffect, useState } from 'react';

import './chat-content.scss';
import { getAvatarColor, getAvatarText, getNameChanel } from 'shared/calculator';
import jwt from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import Routes, { RenderRoutes } from 'routes/routes';

function ChatContent({ location }: any) {
  const [nestedRoutes, setNestedRoutes] = useState([]);
  const [currentUser, setCurrentUser] = useState({} as any);

  const { conversation } = location.state;

  useEffect(() => { 
    const nestRoutes = Routes.find(route => route.path === '/conversation')?.nested;
    const subNestRoutes = nestRoutes?.find(route => route.path === '/conversation/:id')?.nested;
    setNestedRoutes(subNestRoutes as any || []);

    return () => {}
  }, [])

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {
        setCurrentUser(decoded);
      }
    });

    return () => { }
  }, []);

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {
        setCurrentUser(decoded);
      }
    });

    return () => { }
  }, [conversation._id]);

  return !isEmpty(conversation) && (
    <div className="chat-content">
      <div className="chat-content-header">
        <div className="person-card">
          <span className="card-avatar" style={{ backgroundColor: getAvatarColor(conversation.members, currentUser) }}>
            {getAvatarText(conversation.members, currentUser)}
          </span>
          <span className="cartd-title">{conversation && getNameChanel(conversation, currentUser)}</span>
        </div>
        <div className="header-tabs-bar-wrapper">
          <ul className="tabs-bar-list">
            <li className="tabs-bar-item active"><a href="/">Chat</a></li>
          </ul>
        </div>
      </div>
      <RenderRoutes routes={nestedRoutes} />
    </div>
  );
}

export default ChatContent;
