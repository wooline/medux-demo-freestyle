import {exportApp, RootModuleFacade, FacadeExports, patchActions, setConfig} from '@medux/react-web-router';
import type {ModuleGetter, RouteParams, Pagename} from 'modules/config';

type Facade = FacadeExports<RootModuleFacade<ModuleGetter>, RouteParams, Pagename>;

const {App, Modules, Pagenames} = exportApp() as Facade;

// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  type ProxyActions = Facade['Actions'];
  // 生成环境下，加上proxyPollyfill可以适配不支持proxy的低版本浏览器，以下第2个参数由cli自动生成，请勿修改
  // eslint-disable-next-line
  patchActions(
    'ProxyActions',
    '{"app":["Init","Loading","RouteParams","Update","initState","login","logout","navToAccount","putCurUser"],"account":["Init","Loading","RouteParams","Update","initState"],"adminLayout":["Init","Loading","RouteParams","Update","initState","putSiderCollapsed"],"adminHome":["Init","Loading","RouteParams","Update","initState"]}'
  );
}

declare global {
  type APPState = Facade['App']['state'];
  type RouteState = Facade['App']['state']['route'];
  type RouteParams = import('modules/config').RouteParams;
  type PartialRouteParams = import('modules/config').PartialRouteParams;
  const App: Facade['App'];
  const Modules: Facade['Modules'];
  const Pagenames: Facade['Pagenames'];
  const ENV: {apiMaps: {[key: string]: string}};
}

((data: {[key: string]: any}) => {
  // @ts-ignore
  const g = typeof window === 'undefined' ? global : window;
  Object.keys(data).forEach((key) => {
    g[key] = data[key];
  });
})({App, Modules, Pagenames});
