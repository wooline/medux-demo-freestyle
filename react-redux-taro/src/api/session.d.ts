export interface CurUser {
  id: string;
  username: string;
  hasLogin: boolean;
  avatar: string;
  mobile: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface API<Req, Res> {
  Request: Req;
  Response: Res;
}

export type GetItem = API<{}, CurUser>;

export type Login = API<LoginParams, CurUser>;

export type Logout = API<{}, CurUser>;
