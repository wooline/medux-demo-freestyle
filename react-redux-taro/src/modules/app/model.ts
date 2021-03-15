/* eslint-disable no-restricted-globals */
import {ActionTypes, BaseModuleHandlers, BaseModuleState, reducer, effect, LoadingState, errorAction} from '@medux/react-taro-router';
import Taro from '@tarojs/taro';
import {App} from '@/src/Global';
import {CustomError} from '@/src/common/errors';
import {CurUser, LoginParams, RouteParams, api} from './entity';

declare const wx: any;
declare const process: any;

export interface ModuleState extends BaseModuleState<RouteParams> {
  curUser?: CurUser;
  loading: {
    global: LoadingState;
  };
}

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super({
      curUser: undefined,
      loading: {
        global: LoadingState.Stop,
      },
    });
  }

  @reducer
  public putCurUser(curUser: CurUser): ModuleState {
    return {...this.state, curUser};
  }

  @effect()
  public async login(args: LoginParams) {
    const curUser = await api.login(args);
    this.dispatch(this.actions.putCurUser(curUser));
    App.router.back(1, '/my/summary?{}');
  }

  @effect()
  public async logout() {
    const curUser = await api.logout();
    this.dispatch(this.actions.putCurUser(curUser));
    App.router.relaunch({pagename: '/my/summary'});
  }

  @effect(null)
  protected async [ActionTypes.Error](error: CustomError) {
    if (!error.quiet) {
      Taro.showToast({title: error.message, icon: 'none'});
    }
    throw error;
  }

  @effect(null)
  protected async ['this.Init']() {
    // Taro.onError((error) => {
    //   this.dispatch(errorAction(error));
    // });
    // Taro.onUnhandledRejection((error) => {
    //   this.dispatch(errorAction(error.reason));
    // });
    const curUser = await api.getCurUser();
    this.dispatch(this.actions.Update({curUser}, 'init'));
  }
}
