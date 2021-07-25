import { CONVERSATION } from "../const";


export function setConversation(conversation: any) {
  return {
    type: CONVERSATION.SET,
    conversation
  }
} 
