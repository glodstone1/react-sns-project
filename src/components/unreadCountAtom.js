import { atom } from 'recoil';

export const unreadCountState = atom({
  key: 'unreadCountState',
  default: 0,
});