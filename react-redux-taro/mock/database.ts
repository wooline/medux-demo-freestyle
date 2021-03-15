import {CurUser} from '@/src/api/session';
import {ListItem as PhotoListItem} from '@/src/api/photo';
import mockjs from 'mockjs';

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
function createPhotoList() {
  const listData = {};
  mockjs
    .mock({
      'list|100': [
        {
          'id|+1': 1,
          title: '@ctitle(10, 20)',
          departure: '@city',
          type: '@cword(2,5)',
          price: '@natural(1000,2000)',
          hot: '@natural(100,999)',
          comments: '@natural(100,999)',
          coverUrl: '',
        },
      ],
    })
    .list.forEach((item) => {
      item.id = `${item.id}`;
      item.coverUrl = `/client/imgs/${item.id % 17}.jpg`;
      listData[item.id] = item;
    });
  return listData;
}
export const database: {curUser: CurUser; guest: CurUser; adminUser: CurUser; photos: {[id: string]: PhotoListItem}} = {
  curUser: guest,
  guest,
  adminUser,
  photos: createPhotoList(),
};
