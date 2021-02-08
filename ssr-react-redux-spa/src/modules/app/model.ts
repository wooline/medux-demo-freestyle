/* eslint-disable no-restricted-globals */
import {BaseModuleHandlers, BaseModuleState, effect} from '@medux/react-web-router';

export interface ModuleState extends BaseModuleState {}

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super({});
  }

  @effect(null)
  protected async ['this.Init, this.ReInit']() {
    const modules = Object.keys(this.rootState.route.params);
    await Promise.all(modules.map((moduleName) => this.loadModel(moduleName)));
  }
}
