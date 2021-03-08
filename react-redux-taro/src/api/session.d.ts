export interface CurUser {
  id: string;
  username: string;
  hasLogin: boolean;
  avatar: string;
  mobile: string;
}

export interface API<Req, Res> {
  Request: Req;
  Response: Res;
}

export type GetSession = API<{}, CurUser>;
