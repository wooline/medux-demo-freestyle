import {RouteParams} from './entity';

const defaultRouteParams: RouteParams = {
  listSearchPre: {
    pageSize: 10,
    pageCurrent: 1,
    term: undefined,
    sorterField: undefined,
    sorterOrder: undefined,
  },
  listView: '',
  _listVerPre: 0,
  itemIdPre: '',
  itemView: '',
  _itemVerPre: 0,
};

export default defaultRouteParams;
