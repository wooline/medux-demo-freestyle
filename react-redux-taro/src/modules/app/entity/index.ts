import request from '@/src/common/request';

export interface CurUser {
  id: string;
  username: string;
  hasLogin: boolean;
  avatar: string;
  mobile: string;
}

export const guest: CurUser = {
  id: '',
  username: '',
  hasLogin: false,
  avatar: '',
  mobile: '',
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
  public getCurUser(): Promise<CurUser> {
    return request<CurUser>({url: '/api/getSession'}).then((res) => {
      return res.data;
    });
  }

  public login(params: LoginParams): Promise<CurUser> {
    return request<CurUser>({url: '/api/login', method: 'PUT', data: params}).then((res) => {
      return res.data;
    });
  }

  public logout(): Promise<CurUser> {
    return request<CurUser>({url: '/api/logout', method: 'PUT'}).then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
