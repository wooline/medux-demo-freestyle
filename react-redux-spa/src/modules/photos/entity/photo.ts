export interface ListItem {
  title: string;
  departure: string;
  type: string;
  hot: number;
  price: number;
  coverUrl: string;
  comments: number;
}
export interface ListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface ListSearch {
  pageCurrent?: number;
  pageSize?: number;
  term?: string;
  sorterOrder?: 'ascend' | 'descend';
  sorterField?: string;
}

export type ListView = 'list' | '';
export type ItemView = 'detail' | '';

export interface RouteParams {
  listView: ListView;
  listParams: ListSearch;
  _listVer: number;
  itemView: ItemView;
  id: string;
  _itemVer: number;
}

class API {
  // public searchList(args: ListSearch): Promise<{list: ListItem[]; listSummary: ListSummary}> {
  //   return Promise.resolve('');
  // }
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
