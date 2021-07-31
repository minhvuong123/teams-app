import { combineReducers } from 'redux';

import userReducer from './user.reducer';
import conversationReducer from './conversation.reducer';
import socketReducer from './socket.reducer';
import messageReducer from './message.reducer';

const rootReducer = combineReducers({
  userStore: userReducer,
  conversationStore: conversationReducer,
  socketStore: socketReducer,
  messageStore: messageReducer
});

export default  rootReducer;