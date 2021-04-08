import {BaseModuleState, BaseModuleHandlers, reducer, effect} from '@medux/react-web-router';
import fastEqual from 'fast-deep-equal';
import {tips, filterEmpty} from 'common/utils';

export type BaseListView = 'list' | 'selector' | '';
export type BaseItemView = 'detail' | 'edit' | 'create' | '';

export interface BaseListItem {
  id: string;
}
export interface BaseListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  categorys?: {id: string; name: string; list: string[]}[];
}
export type BaseItemDetail = BaseListItem;

export interface BaseListSearch {
  pageCurrent?: number;
  pageSize?: number;
  term?: string;
  category?: string;
  sorterOrder?: 'ascend' | 'descend';
  sorterField?: string;
}

// export interface ListData<ListSearch extends BaseListSearch = BaseListSearch, ListItem extends BaseListItem = BaseListItem, ListSummary extends BaseListSummary = BaseListSummary> {
//   listVer?: number;
//   listSearch?: ListSearch;
//   list?: ListItem[];
//   listSummary?: ListSummary;
//   selectedRows?: ListItem[];
// }

// export interface ItemData<ItemDetail extends BaseItemDetail = BaseItemDetail> {
//   itemVer?: number;
//   itemId?: string;
//   itemDetail?: ItemDetail;
// }

export interface BaseRouteParams<
  ListSearch extends BaseListSearch = BaseListSearch,
  ListView extends string = string,
  ItemView extends string = string
> {
  listView: ListView;
  listSearchPre: ListSearch;
  _listVerPre: number;
  itemView: ItemView;
  itemIdPre: string;
  _itemVerPre: number;
}

export interface BaseListModuleState<R extends CommonResource>
  extends BaseModuleState<{
    listView: R['ListView'];
    listSearchPre: R['ListSearch'];
    _listVerPre: number;
    itemView: R['ItemView'];
    itemIdPre: string;
    _itemVerPre: number;
  }> {
  listVer?: number;
  listSearch?: R['ListSearch'];
  list?: R['ListItem'][];
  listSummary?: R['ListSummary'];
  selectedRows?: R['ListItem'][];
  itemVer?: number;
  itemId?: string;
  itemDetail?: R['ItemDetail'];
}

// export type MultListModuleState<R extends CommonResource> = BaseModuleState<R['RouteParams']> &
//   {
//     [K in keyof R['ListView']]?: ListData<R['ListSearch'], R['ListItem'], R['ListSummary']>;
//   } &
//   {
//     [K in keyof R['ItemView']]?: ItemData<R['ItemDetail']>;
//   };

export type ListSearchFormData<F> = Required<Omit<F, keyof BaseListSearch>>;

export interface CommonResource<ListView extends string = BaseListView, ItemView extends string = BaseItemView> {
  ListView: ListView;
  ItemView: ItemView;
  ListSearch: BaseListSearch;
  ListItem: BaseListItem;
  ListSummary: BaseListSummary;
  ItemDetail: BaseItemDetail;
  UpdateItem: BaseItemDetail;
}

export interface BaseResourceAPI {
  searchList?: (listSearch: BaseListSearch) => Promise<{list: any[]; listSummary: BaseListSummary}>;
  getDetailItem?: (id: string) => Promise<BaseListItem>;
  deleteList?: (ids: string[]) => Promise<void>;
  createItem?: (data: any) => Promise<void>;
  updateItem?: (data: any) => Promise<void>;
  changeListState?: (ids: string[], state: any, remark?: string) => Promise<void>;
}

export class BaseListModuleHandlers<R extends CommonResource, S extends BaseListModuleState<CommonResource>> extends BaseModuleHandlers<S, APPState> {
  protected noneListSearch: R['ListSearch'];

  protected defaultListSearch: R['ListSearch'];

  constructor(initState: S, protected api: BaseResourceAPI) {
    super(initState);
    this.defaultListSearch = initState.listSearchPre;
    this.noneListSearch = Object.keys(this.defaultListSearch).reduce((prev, cur) => {
      prev[cur] = undefined;
      return prev;
    }, {});
  }

  // 删除记录
  @effect()
  public async deleteList(ids?: string[], callback?: (res: any) => void) {
    ids = ids || this.state.selectedRows!.map((item) => item.id);
    if (!ids.length) {
      return;
    }
    const res = await this.api.deleteList!(ids);
    this.dispatch(this.actions.refreshSearch());
    callback ? callback(res) : tips.success('删除成功');
  }

  // 简单修改记录
  @effect()
  public async changeListState(
    {ids, state, remark}: {ids?: string[]; state: Partial<R['ListItem']>; remark?: string},
    callback?: (res: any) => void
  ) {
    ids = ids || this.state.selectedRows!.map((item) => item.id);
    if (!ids.length) {
      return;
    }
    const res = await this.api.changeListState!(ids, state, remark);
    this.dispatch(this.actions.refreshSearch());
    callback ? callback(res) : tips.success('操作成功');
  }

  // 创建记录
  @effect()
  public async createItem(data: R['UpdateItem'], callback?: (res: any) => void) {
    const res = await this.api.createItem!(data);
    this.dispatch(this.actions.sortSearch());
    callback ? callback(res) : tips.success('创建成功');
  }

  // 更新记录
  @effect()
  public async updateItem(data: R['UpdateItem'], callback?: (res: any) => void) {
    const res = await this.api.updateItem!(data);
    this.dispatch(this.actions.refreshSearch());
    callback ? callback(res) : tips.success('修改成功');
  }

  // 继承当前条件刷新列表，多用于table自身的变动如：分页、排序、过滤
  @effect(null)
  public async changeSearch(params: R['ListSearch'] = {}) {
    await this.searchList({params, extend: 'current'});
  }

  // 使用默认条件刷新列表，多用于搜索表单的重置按钮
  @effect(null)
  public async resetSearch(params: R['ListSearch'] = {}) {
    await this.searchList({params, extend: 'default'});
  }

  // 提交搜索表单
  @effect(null)
  public async submitSearch(params: R['ListSearch'] = {}) {
    await this.searchList({params: {...params, pageCurrent: 1}});
  }

  // 按当前条件刷新列表
  @effect(null)
  public async refreshSearch() {
    this.dispatch(this.actions.putSelectedRows());
    await this.searchList({params: {}, extend: 'current'});
  }

  // 按直到排序刷新列表，多用于创建后刷新
  @effect(null)
  public async sortSearch(sorterField: string = 'createdTime') {
    await this.searchList({params: {sorterField, sorterOrder: 'descend'}, extend: 'none'});
  }

  @effect(null)
  public async searchList({params, extend}: {params: R['ListSearch']; extend?: 'default' | 'current' | 'none'}, listView?: R['ListView']) {
    params = params ? filterEmpty(params) : params;
    let listSearchPre: R['ListSearch'];
    if (extend === 'default') {
      listSearchPre = {...this.defaultListSearch, ...params};
    } else if (extend === 'current') {
      listSearchPre = {...this.state.listSearchPre, ...params};
    } else if (extend === 'none') {
      listSearchPre = {...this.noneListSearch, ...params};
    } else {
      listSearchPre = {...params};
    }
    listView = listView || this.state.listView || 'list';
    const routeParams: Partial<BaseRouteParams> = {listView, listSearchPre, _listVerPre: Date.now(), itemView: '', itemIdPre: '', _itemVerPre: 0};
    App.router.push({extendParams: 'current', params: {[this.moduleName]: routeParams}});
  }

  // 展示某条详情
  @effect(null)
  public async showCurrentItem(itemIdPre: string, itemView: R['ItemView'] = 'detail') {
    App.router.push({extendParams: 'current', params: {[this.moduleName]: {itemView, itemIdPre, _itemVerPre: Date.now()}}});
  }

  // 关闭某条详情
  @effect(null)
  public async closeCurrentItem() {
    App.router.push({extendParams: 'current', params: {[this.moduleName]: {itemView: '', itemIdPre: '', _itemVerPre: 0}}});
  }

  // 设置选择行数据
  @reducer
  public putSelectedRows(selectedRows: R['ListItem'][] = []): S {
    return {...this.state, selectedRows};
  }

  // 设置列表数据
  @reducer
  public putSearchList(listSearch?: R['ListSearch'], list?: R['ListItem'][], listSummary?: R['ListSummary'], listVer: number = 0): S {
    return {...this.state, listVer, listSearch, list, listSummary};
  }

  @reducer
  public putCurrentItem(itemId: string = '', itemDetail?: R['ItemDetail'], itemVer: number = 0): S {
    return {...this.state, itemVer, itemId, itemDetail};
  }

  @effect()
  public async fetchList(listSearchPre: R['ListSearch'], _listVerPre: number) {
    const {list, listSummary} = await this.api.searchList!(listSearchPre);
    this.dispatch(this.actions.putSearchList(listSearchPre, list, listSummary, _listVerPre));
  }

  @effect()
  public async fetchItem(itemIdPre: string, _itemVerPre: number) {
    const item = await this.api.getDetailItem!(itemIdPre);
    this.dispatch(this.actions.putCurrentItem(itemIdPre, item, _itemVerPre));
  }

  @effect(null)
  protected async ['this.Init,this.RouteParams']() {
    const prevState = this.prevState || {};
    const {listView, listSearchPre, _listVerPre, _itemVerPre, listVer = 0, listSearch, itemView, itemIdPre, itemId, itemVer = 0} = this.state;
    if (listView) {
      if (_listVerPre > listVer || !fastEqual(listSearchPre, listSearch)) {
        if (listView !== prevState.listView) {
          // 如果listView发生了变化，则先清空上次遗留旧数据再发起新的请求
          this.dispatch(this.actions.putSearchList());
        }
        await this.dispatch(this.actions.fetchList(listSearchPre, _listVerPre));
      }
    }
    if (itemView) {
      if (_itemVerPre > itemVer || itemIdPre !== itemId) {
        await this.dispatch(this.actions.fetchItem(itemIdPre, _itemVerPre));
      }
    }
    //  else if (itemDetail) {
    //   this.dispatch(this.actions.putCurrentItem());
    // }
  }
}
