import request from 'common/request';

export interface RegisterParams {
  username: string;
  password: string;
}

export class API {
  public register(params: RegisterParams): Promise<void> {
    return request.post<void>('/api/app/register', params).then((res) => {
      return undefined;
    });
  }
}

export const api = new API();
