import {CurUser} from '@/src/api/session';

const guest: CurUser = {
  id: '0',
  username: 'guest',
  hasLogin: false,
  avatar: '/client/imgs/guest.png',
  mobile: '',
};
const adminUser: CurUser = {
  id: '1',
  username: 'admin',
  hasLogin: true,
  avatar: '/client/imgs/admin.jpg',
  mobile: '18498982234',
};
export const database: {curUser: CurUser; guest: CurUser; adminUser: CurUser} = {
  curUser: guest,
  guest,
  adminUser,
};
