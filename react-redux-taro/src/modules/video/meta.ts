import {RouteParams} from './entity';

const defaultRouteParams: RouteParams = {
  listSearchPre: {
    pageSize: 10,
    pageCurrent: 1,
    term: null,
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
