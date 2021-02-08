import request from 'common/request';
import {metaKeys} from 'common/meta';

export interface ProjectConfig {
  noticeTimer: number;
}
export interface CurUser {
  id: string;
  username: string;
  hasLogin: boolean;
  avatar: string;
  token?: string;
}
export interface LoginParams {
  username: string;
  password: string;
  keep?: boolean;
}

export interface RegisterParams {
  username: string;
  password: string;
}
export interface Notices {
  count: number;
}
export const guest: CurUser = {
  id: '',
  username: '游客',
  hasLogin: false,
  avatar: `imgs/u1.jpg`,
};

export type AccountView = 'login' | 'register';

export interface RouteParams {
  accountView?: AccountView;
}

export const defaultRouteParams: RouteParams = {
  accountView: undefined,
};
class API {
  public getCurUser(): Promise<CurUser> {
    return request
      .get<CurUser>('/api/app/getSession')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return guest;
      });
  }

  public login(params: LoginParams): Promise<CurUser> {
    return request.post<CurUser>('/api/app/login', params).then((res) => {
      const curUser = res.data;
      localStorage.setItem(metaKeys.AccountTokenStorageKey, curUser.token || '');
      return curUser;
    });
  }

  public logout(): Promise<void> {
    localStorage.setItem(metaKeys.AccountTokenStorageKey, '');
    return Promise.resolve();
  }

  public getProjectConfig(): Promise<ProjectConfig> {
    return request.get<ProjectConfig>('/api/app/getProjectConfig').then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
