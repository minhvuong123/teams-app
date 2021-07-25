

import { useEffect } from 'react';
import AppBar from '../app-bar/app-bar';
import AppContentChat from '../app-content/app-content-chat/app-content-chat';
import AppHeaderBar from '../app-header-bar/app-header-bar';

import jwt from 'jsonwebtoken';


import './app-main.scss';

function AppMain({ history }: any) {

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (err) {
        history.push('/sign-in');
      }
    });
    return () => {}
  }, [history])

  return (
    <div className="app-main">
      <AppHeaderBar />
      <div className="app-content">
        <AppBar />
        <AppContentChat />
      </div>
    </div>
  );
}

export default AppMain;
