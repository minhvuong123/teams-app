import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { AiOutlineSend, AiOutlineTool } from "react-icons/ai";

import 'react-quill/dist/quill.snow.css';
import './chat-content.scss';

function ChatContent() {
  const [value, setValue] = useState('');
  const [modules, setModules] = useState({
    toolbar: false
  });

  const reactQuillRef = useRef();

  useEffect(() => {

  }, []);

  function handleChange(value: any) {
    setValue(value);
  }

  function isEditor(value: any) {
    const toolbar = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          ['image'],
          ['close']
        ],
        handlers: {
          close: () => closeFunction()
        }
      } as any
    }

    setModules(toolbar);
  }

  function closeFunction() {
    const toolbar = {
      toolbar: false
    }
    setModules(toolbar);
  }

  const icons = Quill.import('ui/icons');
  icons["close"] = 'close';

  return (
    <div className="chat-content">
      <div className="chat-content-header">
        <div className="person-card">
          <span className="card-avatar"></span>
          <span className="cartd-title">Nguyễn Võ Minh Vương</span>
        </div>
        <div className="header-tabs-bar-wrapper">
          <ul className="tabs-bar-list">
            <li className="tabs-bar-item active">
              <a href="/">Chat</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="chat-content-message">
        <div className="message-content-container">
          <div className="message-content">
            {/* customer message */}
            <div className="customer-message">
              <div className="message-avatar"></div>
              <div className="message-body">
                <div className="message-body-title">
                  <span className="message-name">Nguyễn Võ Minh Vương</span>
                  <span className="message-timestamp">9:37 PM</span>
                  <div className="message-emoji"></div>
                </div>
                <div className="message-body-content">
                  <p className="message-text">Chát như con cá thát lát ...  Chát như con cá thát lát ...  Chát như con cá thát lát ...  Chát như con cá thát lát ...  Chát như con cá thát lát ...</p>
                  <p className="message-text">Chát như con cá thát lát ...</p>
                  <p className="message-text">Chát như con cá thát lát ... Chát như con cá thát lát ...</p>
                  <p className="message-text">Chát như con cá thát lát ...</p>
                </div>
              </div>
            </div>
            {/* customer message */}
            {/* owner message */}
            <div className="owner-message">
              <div className="message-body">
                <div className="message-body-title">
                  <span className="message-timestamp">9:37 PM</span>
                  <div className="message-emoji"></div>
                </div>
                <div className="message-body-content">
                  <p className="message-text">Chát như con cá thát lát ...  Chát như con cá thát lát ...  Chát như con cá thát lát ...  Chát như con cá thát lát ...  Chát như con cá thát lát ...</p>
                  <p className="message-text">Chát như con cá thát lát ...</p>
                  <p className="message-text">Chát như con cá thát lát ... Chát như con cá thát lát ...</p>
                  <p className="message-text">Chát như con cá thát lát ...</p>
                </div>
              </div>
            </div>
            {/* owner message */}
          </div>
        </div>
        <div className="message-new">
          <ReactQuill
            ref={reactQuillRef as any}
            theme="snow"
            modules={modules}
            value={value}
            onChange={handleChange}
          />
          <div className="extension-icon">
            <div>
              <span className="sub-icons" onClick={isEditor}><AiOutlineTool /></span>
            </div>

            <span className="sub-icons"><AiOutlineSend /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContent;
