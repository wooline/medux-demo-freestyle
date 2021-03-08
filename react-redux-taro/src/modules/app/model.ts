/* eslint-disable no-restricted-globals */
import {ActionTypes, BaseModuleHandlers, BaseModuleState, reducer, effect, LoadingState, errorAction} from '@medux/react-taro-router';
import Taro from '@tarojs/taro';
import {App} from '@/src/Global';
import {CommonErrorCode, QuietError, CustomError} from '@/src/common/errors';
import {CurUser, LoginParams, RouteParams, api, guest} from './entity';

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
    App.router.relaunch('/my/summary?{}');
  }

  @effect(null)
  protected async ['this.Loading']({global}: {global?: LoadingState}) {
    if (global === LoadingState.Start) {
      Taro.showLoading({title: 'Loading...', mask: true});
    } else if (global === LoadingState.Stop) {
      Taro.hideLoading();
    }
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
    // if (process.env.TARO_ENV === 'h5') {
    //   window.addEventListener('unhandledrejection', (error) => {
    //     this.dispatch(errorAction(error.reason));
    //   });
    //   window.addEventListener('error', (error) => {
    //     this.dispatch(errorAction(error));
    //   });
    // } else if (process.env.TARO_ENV === 'weapp') {
    //   wx.onUnhandledRejection((error) => {
    //     this.dispatch(errorAction(error.reason));
    //   });
    //   wx.onError((error) => {
    //     this.dispatch(errorAction(error));
    //   });
    // }
    const curUser = await api.getCurUser();
    this.dispatch(this.actions.Update({curUser}, 'init'));
  }
}
