export interface ListItem {
  id: string;
  title: string;
  hot: number;
  coverUrl: string;
  videoUrl: string;
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

export type GetVideoList = API<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;
