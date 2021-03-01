import React from 'react';
import {Request, Response} from 'express';
import {exportApp, RootModuleFacade, FacadeExports, patchActions, setConfig} from '@medux/react-web-router';
import {ModuleGetter, RouteParams, Pagename} from 'modules/config';
import Loading from 'assets/imgs/loading48x48.gif';

const LoadViewOnLoading = (
  <div className="g-viewLoader">
    <img src={Loading} width="20" height="20" alt="loading..." />
  </div>
);

setConfig({LoadViewOnLoading});

type Facade = FacadeExports<RootModuleFacade<ModuleGetter>, RouteParams, Pagename, Request, Response>;

// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  type ProxyActions = Facade['Actions'];
  // 生成环境下，加上proxyPollyfill可以适配不支持proxy的低版本浏览器，以下第2个参数由cli自动生成，请勿修改
  // eslint-disable-next-line
  patchActions(
    'ProxyActions',
    '{"app":["Init","Loading","RouteParams","Update","initState"],"mainLayout":["Init","Loading","RouteParams","Update","initState"],"photos":["Init","Loading","RouteParams","Update","fetchList","initState","putList"]}'
  );
}

const {App, Modules, Pagenames}: Facade = exportApp();

declare global {
  type APPState = Facade['App']['state'];
  type RouteState = Facade['App']['state']['route'];
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
