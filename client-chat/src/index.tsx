import ReactDOM from 'react-dom';
import './index.scss';
import App from './container/app/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import configureStore from './shared/redux/store';

import 'antd/dist/antd.css';

const store = configureStore();

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);

