import { Collapse } from 'antd';
import { useState } from 'react';
import { RiFilter3Line} from "react-icons/ri";
import { IoMdClose} from "react-icons/io";
import './chat-bar.scss';

const { Panel } = Collapse;

function ChatBar() {
  const [isFilter, setIsFilter] = useState(false);

  function changeFilter() {
    setIsFilter(!isFilter);
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
              <a href="/" className="chat-list-item active">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
              <a href="/" className="chat-list-item">
                <span className="item-avatar"></span>
                <div className="item-group">
                  <div className="group-title">
                    <span className="item-name">Nguyễn Võ Minh Vương</span>
                    <span className="item-timestamp">4:53 PM</span>
                  </div>
                  <span className="item-preview">message chat</span>
                </div>
              </a>
            </div>
          </Panel>  
        </Collapse>
      </div>
    </div>
  );
}

export default ChatBar;
