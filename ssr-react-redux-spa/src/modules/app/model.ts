/* eslint-disable no-restricted-globals */
import {BaseModuleHandlers, BaseModuleState, effect} from '@medux/react-web-router';

export interface ModuleState extends BaseModuleState {}

export class ModuleHandlers extends BaseModuleHandlers<ModuleState, APPState> {
  constructor() {
    super({});
  }
}
