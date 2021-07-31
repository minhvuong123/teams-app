import { List } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { isEmpty } from 'lodash';

import jwt from 'jsonwebtoken';

import './search-bar.scss';
import { API_LINK } from 'shared/const';


function SearchBar() {
  const [text, setText] = useState('');
  const [dataFinds, setDataFinds] = useState([] as any);

  async function SearchChange(event: any): Promise<void> {
    const stringText = event.target.value;
    setText(stringText);

    const userUrl = `${API_LINK}/users/filter`;
    const usersResult = await axios.post(userUrl, { value: stringText });

    const { data } = usersResult || {};
    const { users } = data || {};

    if (users) {
      setDataFinds(users);
    }
  }

  async function createConversation(item: any): Promise<void> {
    const token = window.sessionStorage.getItem('token');
    jwt.verify(token as string, 'kiwi', async function (err, decoded: any) {
      if (!err) {
        const conversationUrl = `${API_LINK}/conversation/create`;
        const conversationResult = await axios.post(conversationUrl, { conversation : { members: [decoded._id, item._id] }});

        if (conversationResult) {

        }
      }
    });
  }

  return (
    <div className="search-bar">
      <input className="search-bar-input" value={text} onChange={SearchChange} type="text" placeholder="Search" />
      <div className="search-list">
        {
          !isEmpty(dataFinds)
          && <List
            bordered
            dataSource={dataFinds}
            renderItem={item => (
              <List.Item className="active" onClick={() => createConversation(item)}>
                <div className="item-avatar"></div>
                <span className="item-text">{(item as any).user_fullname}</span>
              </List.Item>
            )}
          />
        }

      </div>
    </div>
  );
}

export default SearchBar;