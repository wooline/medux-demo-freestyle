import React from 'react';
import {exportApp, RootModuleFacade, FacadeExports, patchActions, setConfig} from '@medux/react-web-router';
import {ModuleGetter, RouteParams, Pagename} from 'modules/config';
import Loading from 'assets/imgs/loading48x48.gif';

const LoadViewOnLoading = (
  <div className="g-viewLoader">
    <img src={Loading} width="20" height="20" alt="loading..." />
  </div>
);
const LoadViewOnError = <div className="g-viewLoader">error</div>;

setConfig({LoadViewOnLoading, LoadViewOnError});

type APP = FacadeExports<RootModuleFacade<ModuleGetter>, RouteParams, Pagename>;

const {App, Modules, Pagenames}: APP = exportApp();

// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  type ProxyActions = APP['Actions'];
  // 生成环境下，加上proxyPollyfill可以适配不支持proxy的低版本浏览器，以下第2个参数由cli自动生成，请勿修改
  // eslint-disable-next-line
  patchActions(
    'ProxyActions',
    '{"app":["Init","Loading","RouteParams","Update","initState"],"mainLayout":["Init","Loading","RouteParams","Update","initState"],"photos":["Init","Loading","RouteParams","Update","fetchList","initState","putList"]}'
  );
}

declare global {
  type APPState = APP['App']['state'];
  type RouteState = APP['App']['state']['route'];
  const App: APP['App'];
  const Modules: APP['Modules'];
  const Pagenames: APP['Pagenames'];
  const ENV: {apiMaps: {[key: string]: string}};
}

((data: {[key: string]: any}) => {
  // @ts-ignore
  const g = typeof window === 'undefined' ? global : window;
  Object.keys(data).forEach((key) => {
    g[key] = data[key];
  });
})({App, Modules, Pagenames});
