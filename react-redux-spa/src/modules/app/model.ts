/* eslint-disable no-restricted-globals */
import {ActionTypes, BaseModuleHandlers, BaseModuleState, effect, LoadingState, errorAction} from '@medux/react-web-router';
import {CurUser, api} from './entity';

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
  protected async [ActionTypes.Error](error: {message: string}) {
    // eslint-disable-next-line no-alert
    alert(error.message);
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
    const curUser = await api.getCurUser();
    this.dispatch(this.actions.Update({curUser}, 'init'));
  }
}
