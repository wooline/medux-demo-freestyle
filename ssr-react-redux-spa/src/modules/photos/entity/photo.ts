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
