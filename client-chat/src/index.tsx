import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './container/app/App';
import { BrowserRouter as Router } from 'react-router-dom';

import 'antd/dist/antd.css';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

