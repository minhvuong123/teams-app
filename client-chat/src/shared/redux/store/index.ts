import { compose, createStore } from 'redux';
import rootReducer from 'shared/redux/reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

const configureStore = () => {
  const store = createStore(
    rootReducer,
    compose(window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']())
  );
  return store;
}

export default configureStore;