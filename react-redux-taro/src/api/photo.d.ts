export interface ListItem {
  id: string;
  title: string;
  departure: string;
  type: string;
  hot: number;
  comments: number;
  price: number;
  coverUrl: string;
}
export interface ListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface ListSearch {
  pageCurrent: number;
  pageSize: number;
  term: string | null;
  sorterOrder: 'ascend' | 'descend';
  sorterField: string;
}

export interface ItemDetail extends ListItem {
  remark: string;
  picList: string[];
}
export interface API<Req, Res> {
  Request: Req;
  Response: Res;
}

export type GetList = API<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;

export type GetItem = API<{id: string}, ItemDetail>;
