import request from '@/src/common/request';

export interface ListItem {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  createdTime: string;
  replies: number;
}
export interface ListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface ListSearch {
  articleId: string;
  pageCurrent: number;
  pageSize: number;
  sorterOrder: 'ascend' | 'descend';
  sorterField: string;
}

export type ListView = 'list' | '';
export type ItemView = 'detail' | '';

export interface RouteParams {
  listView: ListView;
  listSearchPre: ListSearch;
  listVerPre: number;
  itemView: ItemView;
  itemIdPre: string;
  itemVerPre: number;
}

class API {
  public getList(args: ListSearch): Promise<{list: ListItem[]; listSummary: ListSummary}> {
    return request<{list: ListItem[]; listSummary: ListSummary}>({url: '/api/getCommentList'}).then((res) => {
      return res.data;
    });
  }
  // public getDetailItem(id: string): Promise<ItemDetail> {
  //   if (!id) {
  //     return Promise.resolve({} as any);
  //   }
  //   return request('get', '/api/member/:id', {id});
  // }
  // public createItem(item: UpdateItem): Promise<void> {
  //   const {username, ...info} = item;
  //   return request('post', '/api/member', {}, {username, info});
  // }
  // public updateItem(item: UpdateItem): Promise<void> {
  //   const {id, ...info} = item;
  //   return request('put', '/api/member/:id', {id}, {id, info});
  // }
  // public deleteList(ids: string[]): Promise<void> {
  //   return request('delete', '/api/member', {}, {ids});
  // }
  // public changeListState(ids: string[], state: any, remark?: string): Promise<any> {
  //   return request('put', '/api/member', {}, {ids, state});
  // }
}

export const api = new API();
