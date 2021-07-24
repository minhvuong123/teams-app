import { List } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { isEmpty } from 'lodash';

import './search-bar.scss';
import { API_LINK } from 'shared/const';


function SearchBar() {
  const [text, setText] = useState('');
  const [dataFinds, setDataFinds] = useState([] as any);

  async function SearchChange(event: any): Promise<void> {
    const stringText = event.target.value;
    setText(stringText);

    const getUserUrl = `${API_LINK}/users/filter`;
    const usersResult = await axios.post(getUserUrl, { value: stringText });

    const { data } = usersResult || {};
    const { users } = data || {};

    if (users) {
      setDataFinds(users);
    }
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
              <List.Item className="active">
                <div className="item-avatar"></div>
                <span className="item-text">{(item as any).user_name}</span>
              </List.Item>
            )}
          />
        }

      </div>
    </div>
  );
}

export default SearchBar;