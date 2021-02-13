import {BaseModuleState, BaseModuleHandlers, reducer, effect} from '@medux/react-web-router';
import {TabNav, MenuItem, api} from './entity';

export interface ModuleState extends BaseModuleState {
  siderCollapsed?: boolean;
  menuData: MenuItem[];
  tabNavCurUrl?: string;
  tabNavEditor?: TabNav;
}

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super({menuData: []});
  }

  @reducer
  public putSiderCollapsed(): ModuleState {
    return {...this.state, siderCollapsed: !this.state.siderCollapsed};
  }

  private getCurTabNav(): TabNav {
    const url = App.router.getUrl();
    const title = document.title;
    return {url, title};
  }

  @effect(null)
  protected async ['this.Init']() {
    const menuData = await api.getMenuData();
    const {url} = this.getCurTabNav();
    this.dispatch(this.actions.Update({menuData, tabNavCurUrl: url, tabNavEditor: undefined}, 'init'));
  }
}
