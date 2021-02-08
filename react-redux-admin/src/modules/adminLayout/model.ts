import {BaseModuleState, BaseModuleHandlers, reducer} from '@medux/react-web-router';
import {TabNav, MenuItem, api} from './entity';

export interface ModuleState extends BaseModuleState {
  siderCollapsed?: boolean;
  menuData: MenuItem[];
}

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super({menuData: []});
  }

  @reducer
  public putSiderCollapsed(): ModuleState {
    return {...this.state, siderCollapsed: !this.state.siderCollapsed};
  }
}
