import {BaseModuleState, BaseModuleHandlers, reducer, effect} from '@medux/react-taro-router';
import fastEqual from 'fast-deep-equal';
import {api, ListItem, ListSearch, ListSummary, ItemDetail, RouteParams} from './entity';
import defaultRouteParams from './meta';

export type ModuleState = BaseModuleState<RouteParams> & {
  listVer?: number;
  listSearch?: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  itemVer?: number;
  itemId?: string;
  itemDetail?: ItemDetail;
};

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super(defaultRouteParams);
  }

  @reducer
  public putList(listSearch?: ListSearch, list?: ListItem[], listSummary?: ListSummary, listVer: number = 0): ModuleState {
    return {...this.state, listVer, listSearch, list, listSummary};
  }

  @effect(null)
  public async fetchList(listSearchPre: ListSearch, listVerPre: number) {
    if (listVerPre !== this.state.listVerPre) {
      this.dispatch(this.actions.Update({listVerPre}, 'fetchList'));
    }
    const {list, listSummary} = await api.getList(listSearchPre);
    if (listVerPre === this.state.listVerPre) {
      this.dispatch(this.actions.putList(listSearchPre, list, listSummary, listVerPre));
    }
  }

  @reducer
  public putCurrentItem(itemId: string = '', itemDetail?: ItemDetail, itemVer: number = 0): ModuleState {
    return {...this.state, itemVer, itemId, itemDetail};
  }

  @effect()
  public async fetchItem(itemIdPre: string, _itemVerPre: number) {
    const item = await api.getItem(itemIdPre);
    this.dispatch(this.actions.putCurrentItem(itemIdPre, item, _itemVerPre));
  }

  @effect(null)
  protected async ['this.Init, this.RouteParams']() {
    const prevState = this.prevState || {};
    const {listView, listSearchPre, listVerPre, itemVerPre, listVer = 0, listSearch, itemView, itemIdPre, itemId, itemVer = 0} = this.state;
    if (listView) {
      if (listVerPre > listVer || !fastEqual(listSearchPre, listSearch)) {
        if (listView !== prevState.listView) {
          // 如果listView发生了变化，则先清空上次遗留旧数据再发起新的请求
          // this.dispatch(this.actions.putSearchList());
        }
        await this.dispatch(this.actions.fetchList(listSearchPre, listVerPre));
      }
    }
    if (itemView) {
      if (itemVerPre > itemVer || itemIdPre !== itemId) {
        await this.dispatch(this.actions.fetchItem(itemIdPre, itemVerPre));
      }
    }
  }
}
