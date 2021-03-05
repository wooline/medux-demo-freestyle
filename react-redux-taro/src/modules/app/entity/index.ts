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

export type SubView = 'Login';

export interface LoginParams {
  username: string;
  password: string;
}
export interface RouteParams {
  subView?: SubView;
}
class API {
  public login(params: LoginParams): Promise<CurUser> {
    return Promise.reject('用户名或密码错误');
  }

  public getCurUser(): Promise<CurUser> {
    return Promise.resolve(guest);
  }
}

export const api = new API();
