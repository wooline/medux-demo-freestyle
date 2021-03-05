import request from '@/src/common/request';

export interface UpdateUserInfo {
  nickname: string;
}
export type SubView = 'UserSummary' | 'UserInfo';

export interface RouteParams {
  subView?: SubView;
}

class API {
  public updateUserInfo(args: UpdateUserInfo): Promise<void> {
    return request<void>({url: '/api/getVideoList', method: 'PUT', data: args}).then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
