import { CONVERSATION } from 'shared/redux/const';

const conversationState = {
  conversation: {}
}

export default function userReducer(state = conversationState, action: any) {
  switch(action.type) {
    case CONVERSATION.SET: 
      const { conversation } = action;
      return {...state, conversation}
    default:
      return state;
  }
}