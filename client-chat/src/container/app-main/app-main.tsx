

import { useEffect } from 'react';
import AppBar from '../app-bar/app-bar';
import AppContentChat from '../app-content/app-content-chat/app-content-chat';
import AppHeaderBar from '../app-header-bar/app-header-bar';

import jwt from 'jsonwebtoken';
import io from 'socket.io-client';
import { connect } from 'react-redux';

import './app-main.scss';
import { setSocket } from 'shared/redux/actions';

function AppMain({ history, setSocketStore }: any) {

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (err) {
        history.push('/sign-in');
      } else {
        setSocketStore(io("ws://localhost:4000"));
      }
    });
    return () => {}
  }, [history, setSocketStore])

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

const mapDispatchToProps = (dispatch: any) => {
  return {
    setSocketStore: (user: any) => dispatch(setSocket(user))
  }
}

export default connect(null, mapDispatchToProps)(AppMain);