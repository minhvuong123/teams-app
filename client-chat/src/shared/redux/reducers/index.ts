import { combineReducers } from 'redux';

import userReducer from './user.reducer';
import conversationReducer from './conversation.reducer';
import socketReducer from './socket.reducer';

const rootReducer = combineReducers({
  userStore: userReducer,
  conversationStore: conversationReducer,
  socketStore: socketReducer
});

export default  rootReducer;