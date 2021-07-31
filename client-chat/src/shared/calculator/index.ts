import { MessageModel } from "shared/model";


export  function getNameChanel(chanel: any, currentUser: any): string {
  const { members } = chanel;
  switch(members.length) {
    case 1: 
      return members[0].user_fullname;
    case 2:
      const friend = members.filter((member: any) => member._id !== currentUser._id);
      return friend[0].user_fullname;
    default: 
      return '' 
  }
}

export function groupMessage(messages: MessageModel[]): MessageModel[] {
  const groupMessageByTime = [] as MessageModel[]; // time = 1 minute

  messages.forEach((message: MessageModel) => {

    // reset seconds and milliseconds to 0 and then getTime
    const time = new Date(message.createdAt);
    time.setSeconds(0);
    time.setMilliseconds(0);
    const createdAtMinutes = time.getTime();

    // Try to get existing message group
    const currentGroup = groupMessageByTime.filter(
      (msgGrp: any) => msgGrp.createdAtRound === createdAtMinutes && message.sender?._id === msgGrp.sender._id
    );

    // If we've got the existing group, add the message, otherwise create a new group
    if (currentGroup.length) {
      currentGroup[0].messages?.push(message.text || '');
    } else {
      groupMessageByTime.push({
        conversationId: message.conversationId,
        sender: message.sender,
        messages: [message.text || ''],
        createdAtRound: createdAtMinutes,
        createdAt: message.createdAt
      });
    }
  });

  return groupMessageByTime || [];
}

export function getAvatarText(members: any[], currentUser: any): string {
  switch (members.length) {
    case 1:
      return members[0].user_firstname[0] + members[0].user_lastname[0];
    case 2:
      const friend = members.filter((member: any) => member._id !== currentUser._id);
      return friend[0].user_firstname[0] + friend[0].user_lastname[0];
    default:
      break;
  }
  return '';
}

export function getAvatarTextObject(firstname: string = '', lastName: string = ''): string {
  return firstname[0] + lastName[0];
}

export function getAvatarColor(members: any[], currentUser: any): string {
  switch (members.length) {
    case 1:
      return members[0].user_background_color;
    case 2:
      const friend = members.filter((member: any) => member._id !== currentUser._id);
      return friend[0].user_background_color;
    default:
      break;
  }
  return '';
}