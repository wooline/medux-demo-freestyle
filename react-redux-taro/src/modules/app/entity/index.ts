export interface CurUser {
  id: string;
  username: string;
  hasLogin: boolean;
  avatar: string;
  mobile: string;
  token?: string;
}

export const guest: CurUser = {
  id: '',
  username: '游客',
  hasLogin: false,
  avatar: 'imgs/u1.jpg',
  mobile: '18928760092',
};

export interface RouteParams {}
class API {
  public getCurUser(): Promise<CurUser> {
    return Promise.resolve(guest);
  }
}

export const api = new API();
