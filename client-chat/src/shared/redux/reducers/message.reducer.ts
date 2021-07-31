import { MESSAGE } from 'shared/redux/const';

const messageState = {
  message: {}
}

export default function userMessage(state = messageState, action: any) {
  switch(action.type) {
    case MESSAGE.SET: 
      const { message } = action;
      return {...state, message}
    default:
      return state;
  }
}