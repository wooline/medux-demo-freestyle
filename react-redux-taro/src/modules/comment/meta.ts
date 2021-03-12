import {RouteParams} from './entity';

const defaultRouteParams: RouteParams = {
  listSearchPre: {
    articleId: '',
    pageSize: 10,
    pageCurrent: 1,
    sorterField: '',
    sorterOrder: 'ascend',
  },
  listView: '',
  listVerPre: 0,
  itemIdPre: '',
  itemView: '',
  itemVerPre: 0,
};

export default defaultRouteParams;
