
import './app-content-chat.scss';
import ChatBar from './chat-bar/chat-bar';
import ChatContent from './chat-content/chat-content';

function AppContentChat() {
  return (
    <div className="app-content-chat">
      <ChatBar />
      <ChatContent />
    </div>
  );
}

export default AppContentChat;
