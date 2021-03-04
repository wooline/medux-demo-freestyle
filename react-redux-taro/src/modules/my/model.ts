import {BaseModuleState, BaseModuleHandlers, effect} from '@medux/react-taro-router';
import {api, UpdateUserInfo, RouteParams} from './entity';
import defaultRouteParams from './meta';

export type ModuleState = BaseModuleState<RouteParams>;

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super(defaultRouteParams);
  }

  @effect()
  public async updateUserInfo(data: UpdateUserInfo) {
    await api.updateUserInfo(data);
    // this.dispatch(global.actions.app.setCurUser(data));
    // global.historyActions.navigateBack(1);
  }
}
