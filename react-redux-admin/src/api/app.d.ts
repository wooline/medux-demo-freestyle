export interface ListItem {
  id: string;
  title: string;
  departure: string;
  type: string;
  hot: number;
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
  pageCurrent?: number;
  pageSize?: number;
  term?: string;
  sorterOrder?: 'ascend' | 'descend';
  sorterField?: string;
}

export interface API<Req, Res> {
  Request: Req;
  Response: Res;
}

export type GetPhotoList = API<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;

export interface ProjectConfig {
  noticeTimer: number;
}
