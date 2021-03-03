/* eslint-disable no-restricted-globals */
import {ActionTypes, BaseModuleHandlers, BaseModuleState, effect, LoadingState, errorAction} from '@medux/react-taro-router';
import Taro from '@tarojs/taro';
import {CurUser, api} from './entity';

declare const wx: any;
declare const process: any;

export interface ModuleState extends BaseModuleState {
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
      loading: {
        global: LoadingState.Stop,
      },
    });
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
  protected async [ActionTypes.Error](error: {message: string}) {
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
