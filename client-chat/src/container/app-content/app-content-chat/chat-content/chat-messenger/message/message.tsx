
import './message.scss';

// English.
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { getAvatarTextObject } from 'shared/calculator';

TimeAgo.addLocale(en);

const timeAgo = new TimeAgo('en-US');

function Message({ message, currentUser }: any) {
  return (
    message.sender._id === currentUser._id
    ? <div className="owner-message">
      <div className="message-body">
        <div className="message-body-title">
          <span className="message-timestamp">{timeAgo.format(new Date(message.createdAtRound))}</span>
          <div className="message-emoji"></div>
          <div className="message-first" dangerouslySetInnerHTML={{ __html: message.messages[0] }}></div>
        </div>
        {
          message.messages.slice(1, message.messages.length).length > 0
          &&  <div className="message-body-content"
            dangerouslySetInnerHTML={{ __html: message.messages.slice(1, message.messages.length).join('') }}>
          </div>
        }
      </div>
    </div>
    : <div className="customer-message">
      <div className="message-avatar" style={{ backgroundColor: message.sender.user_background_color }}>
        {getAvatarTextObject(message.sender.user_firstname, message.sender.user_lastname)}
      </div>
      <div className="message-body">
        <div className="message-body-title">
          <span className="message-name">{message.sender.user_fullname}</span>
          <span className="message-timestamp">{timeAgo.format(new Date(message.createdAt))}</span>
          <div className="message-emoji"></div>
          <div className="message-first" dangerouslySetInnerHTML={{ __html: message.messages[0] }}></div>
        </div>
        {
          message.messages.slice(1, message.messages.length).length > 0
          &&  <div className="message-body-content"
            dangerouslySetInnerHTML={{ __html: message.messages.slice(1, message.messages.length).join('') }}>
          </div>
        }
      </div>
    </div>
)}

export default Message;
