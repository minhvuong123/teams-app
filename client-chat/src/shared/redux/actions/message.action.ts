import { MessageModel } from "shared/model";
import { MESSAGE } from "../const";


export function setMessage(message: MessageModel) {
  return {
    type: MESSAGE.SET,
    message
  }
} 
