import { SOCKET } from "../const";


export function setSocket(socket: any) {
  return {
    type: SOCKET.SET,
    socket
  }
} 
