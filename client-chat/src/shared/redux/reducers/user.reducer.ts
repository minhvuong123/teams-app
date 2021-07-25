import { USER } from 'shared/redux/const';

const userState = {
  user: {}
}

export default function userReducer(state = userState, action: any) {
  switch(action.type) {
    case USER.SET: 
      const { user } = action;
      return {...state, user}
    default:
      return state;
  }
}