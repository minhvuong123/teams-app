import { SOCKET } from 'shared/redux/const';

const socketState = {
  socket: {}
}

export default function socketReducer(state = socketState, action: any) {
  switch(action.type) {
    case SOCKET.SET: 
      const { socket } = action;
      return {...state, socket}
    default:
      return state;
  }
}