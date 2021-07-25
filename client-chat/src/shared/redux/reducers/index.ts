import { combineReducers } from 'redux';

import userReducer from './user.reducer';
import conversationReducer from './conversation.reducer';

const rootReducer = combineReducers({
  userStore: userReducer,
  conversationStore: conversationReducer
});

export default  rootReducer;