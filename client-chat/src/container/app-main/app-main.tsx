

import AppBar from '../app-bar/app-bar';
import AppContentChat from '../app-content/app-content-chat/app-content-chat';
import AppHeaderBar from '../app-header-bar/app-header-bar';
import './app-main.scss';

function AppMain() {
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
