
import { useEffect, useState } from 'react';
import Routes, { RenderRoutes } from 'routes/routes';
import './app-content-chat.scss';
import ChatBar from './chat-bar/chat-bar';

function AppContentChat() {
  const [nestedRoutes, setNestedRoutes] = useState([]);

  useEffect(() => {
    const nestRoutes = Routes.find(route => route.path === '/conversation')?.nested;
    setNestedRoutes(nestRoutes as any || []);
    return () => {}
  }, [])

  return (
    <div className="app-content-chat">
      <ChatBar />

      {/* ChatContent */}
      <RenderRoutes routes={nestedRoutes} />
      {/* <ChatContent /> */}
    </div>
  );
}

export default AppContentChat;
