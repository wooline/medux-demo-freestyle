import {BaseModuleState, BaseModuleHandlers, effect} from '@medux/react-web-router';

export interface ModuleState extends BaseModuleState {
  count: number;
  age: number;
}

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super({
      count: 1,
      age: 1,
    });
  }

  @effect(null)
  async ['photos.add']() {
    console.log(this.currentState, this.state, this.prevState);
    this.dispatch(this.actions.Update({count: this.state.count + 1}, 'add-count'));
    this.dispatch(this.actions.Update({age: this.state.age + 1}, 'add-age'));
  }
}
