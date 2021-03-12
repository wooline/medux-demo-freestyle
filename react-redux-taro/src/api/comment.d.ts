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
