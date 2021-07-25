import { USER } from "../const";


export function setUser(user: any) {
  return {
    type: USER.SET,
    user
  }
} 
