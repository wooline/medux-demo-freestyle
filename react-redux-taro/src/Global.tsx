import {exportApp, RootModuleFacade, FacadeExports} from '@medux/react-taro-router';
import type {ModuleGetter, RouteParams, Pagename} from './modules/config';

type Facade = FacadeExports<RootModuleFacade<ModuleGetter>, RouteParams, Pagename>;

export const {App, Modules, Pagenames}: Facade = exportApp();

//@ts-ignore
const GlobalVar = process.GlobalVar;

export const StaticServer: string = GlobalVar.StaticServer;

export const ApiMaps: {[key: string]: string} = GlobalVar.ApiMaps;
declare global {
  type APPState = Facade['App']['state'];
  type RouteState = Facade['App']['state']['route'];
}
