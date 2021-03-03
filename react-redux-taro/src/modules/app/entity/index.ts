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
    return Promise.resolve(guest);
  }
}

export const api = new API();
