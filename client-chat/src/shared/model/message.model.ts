export interface MessageModel {
  conversationId?: string;
  createdAt?: number | string | any;
  createdAtRound?: number;
  messages?: string[];
  text?: string;
  sender?: SenderModel;
}

export interface SenderModel {
  _id?: string;
  user_avatar?: string;
  user_name?: string;
}