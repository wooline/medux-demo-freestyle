import request from '@/src/common/request';

export interface ListItem {
  id: string;
  title: string;
  departure: string;
  type: string;
  hot: number;
  price: number;
  coverUrl: string;
  comments: number;
}
export interface ListSummary {
  firstSize?: number;
  pageCurrent: number | [number, number];
  pageSize: number;
  totalItems: number;
  totalPages: number;
  scrollTop?: number;
}
export interface ListSearch {
  pageCurrent: number | [number, number];
  pageSize: number;
  term: string | null;
  sorterOrder: 'ascend' | 'descend';
  sorterField: string;
}

export type ListView = 'list' | '';
export type ItemView = 'detail' | '';

export interface ItemDetail extends ListItem {
  remark: string;
  picList: string[];
}
export interface RouteParams {
  listView: ListView;
  listSearchPre: ListSearch;
  listVerPre: number;
  itemView: ItemView;
  itemIdPre: string;
  itemVerPre: number;
}

class API {
  public getList(params: ListSearch): Promise<{list: ListItem[]; listSummary: ListSummary}> {
    return request<{list: ListItem[]; listSummary: ListSummary}>({url: '/api/getPhotoList', data: params}).then((res) => {
      return res.data;
    });
  }

  public getItem(id: string): Promise<ItemDetail> {
    if (!id) {
      return Promise.resolve({} as any);
    }
    return request<ItemDetail>({url: '/api/getPhotoItem', data: {id}}).then((res) => {
      return res.data;
    });
  }
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
