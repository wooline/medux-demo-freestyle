import request from 'common/request';

export interface CurUser {
  id: string;
  username: string;
  hasLogin: boolean;
  avatar: string;
  token?: string;
}

export const guest: CurUser = {
  id: '',
  username: '游客',
  hasLogin: false,
  avatar: `imgs/u1.jpg`,
};
class API {
  public getCurUser(): Promise<CurUser> {
    return request
      .get<CurUser>('/api/getSession')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return guest;
      });
  }
}

export const api = new API();
