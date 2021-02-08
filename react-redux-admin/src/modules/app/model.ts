/* eslint-disable no-restricted-globals */
import {ActionTypes, BaseModuleHandlers, BaseModuleState, reducer, effect, LoadingState, errorAction} from '@medux/react-web-router';
import {AccountView, ProjectConfig, RouteParams, CurUser, LoginParams, api} from './entity';

export interface ModuleState extends BaseModuleState<RouteParams> {
  projectConfig: ProjectConfig;
  curUser: CurUser;
  loading: {
    global: LoadingState;
  };
}

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super({
      curUser: {
        id: '',
        username: 'guest',
        hasLogin: false,
        avatar: '',
      },
      projectConfig: {noticeTimer: 20},
      loading: {
        global: LoadingState.Stop,
      },
    });
  }

  @reducer
  public putCurUser(curUser: CurUser): ModuleState {
    return {...this.state, curUser};
  }

  @effect(null)
  public async navToAccount(accountView?: AccountView) {
    App.router.push({extendParams: 'current', params: {app: {accountView}}});
  }

  @effect()
  public async login(args: LoginParams) {
    const curUser = await api.login(args);
    if (this.state.curUser.hasLogin) {
      App.router.nativeRouter.refresh();
    }
    this.dispatch(this.actions.putCurUser(curUser));
    this.dispatch(this.actions.navToAccount());
  }

  @effect()
  public async logout() {
    await api.logout();
    if (this.state.curUser.hasLogin) {
      App.router.nativeRouter.refresh();
    }
  }

  @effect(null)
  protected async [ActionTypes.Error](error: {code: string; message: string}) {
    throw error;
  }

  @effect(null)
  protected async ['this.Init']() {
    window.addEventListener('unhandledrejection', (error) => {
      this.dispatch(errorAction(error.reason));
    });
    window.addEventListener('error', (error) => {
      this.dispatch(errorAction(error));
    });
    const projectConfig = await api.getProjectConfig();
    const curUser = await api.getCurUser();
    this.dispatch(this.actions.Update({projectConfig, curUser}, 'init'));

    const routeData = this.rootState.route.params;
    if (routeData.adminLayout && !curUser.hasLogin) {
      this.dispatch(this.actions.navToAccount('login'));
    }
  }
}
