import {exportApp, RootModuleFacade, FacadeExports} from '@medux/react-taro-router';
import type {ModuleGetter, RouteParams, Pagename} from './modules/config';

type Facade = FacadeExports<RootModuleFacade<ModuleGetter>, RouteParams, Pagename>;

export const {App, Modules, Pagenames}: Facade = exportApp();

export const StaticServer: string = 'http://192.168.127.226:4002';

export const ApiMaps = {
  '/api/': 'http://192.168.127.226:4002/api/',
};

declare global {
  type APPState = Facade['App']['state'];
  type RouteState = Facade['App']['state']['route'];
}
