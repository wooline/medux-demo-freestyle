import {BaseModuleState, BaseModuleHandlers, reducer, effect} from '@medux/react-taro-router';
import fastEqual from 'fast-deep-equal';
import {api, ListItem, ListSearch, ListSummary, RouteParams} from './entity';
import defaultRouteParams from './meta';

export type ModuleState = BaseModuleState &
  RouteParams & {
    listVer?: number;
    listSearch?: ListSearch;
    list?: ListItem[];
    listSummary?: ListSummary;
    itemVer?: number;
    itemId?: string;
  };

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super(defaultRouteParams);
  }

  @reducer
  public putList(listSearch?: ListSearch, list?: ListItem[], listSummary?: ListSummary, listVer: number = 0): ModuleState {
    return {...this.state, listVer, listSearch, list, listSummary};
  }

  @effect()
  public async fetchList(listSearchPre: ListSearch, _listVerPre: number) {
    const {list, listSummary} = await api.getList(listSearchPre);
    this.dispatch(this.actions.putList(listSearchPre, list, listSummary, _listVerPre));
  }

  @effect(null)
  protected async ['this.Init, this.RouteParams']() {
    const prevState = this.prevState || {};
    const {listView, listSearchPre, listVerPre, itemVerPre, listVer = 0, listSearch, itemId, itemVer = 0} = this.state;
    if (listView) {
      if (listVerPre > listVer || !fastEqual(listSearchPre, listSearch)) {
        if (listView !== prevState.listView) {
          console.log(4444);
          // 如果listView发生了变化，则先清空上次遗留旧数据再发起新的请求
          // this.dispatch(this.actions.putSearchList());
        }
        await this.dispatch(this.actions.fetchList(listSearchPre, listVerPre));
      }
    }
  }
}
