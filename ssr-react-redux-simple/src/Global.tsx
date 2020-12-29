import React from 'react';
import {exportApp, RootModuleFacade, FacadeExports, patchActions} from '@medux/react-web-router';
import {ModuleGetter, RouteParams} from 'modules/config';
import Loading from 'assets/imgs/loading48x48.gif';

// @ts-ignore
const Project = process.env.PROJ_CONFIG;
interface Response {
  redirect(status: 301 | 302, path: string);
}
interface Request {
  url: string;
}
const DefLoading = () => (
  <div className="g-viewLoader">
    <img src={Loading} alt="loading..." />
  </div>
);
const DefError = () => <div className="g-viewLoader">error</div>;

type APP = FacadeExports<RootModuleFacade<ModuleGetter>, RouteParams, Request, Response>;

// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  type ProxyActions = APP['Actions'];
  // 生成环境下，加上proxyPollyfill可以适配不支持proxy的低版本浏览器，以下第2个参数由cli自动生成，请勿修改
  // eslint-disable-next-line
  patchActions('ProxyActions', '{"app":["Init","Loading","RouteParams","Update","initState"],"mainLayout":["Init","Loading","RouteParams","Update","initState","photos.add"],"photos":["Init","Loading","RouteParams","Update","add","initState","this.add"]}');
}

const {App, Modules}: APP = exportApp();

const baseLoadView = App.loadView;

App.loadView = (moduleName, viewName, options, loading: React.ComponentType<any> = DefLoading, error: React.ComponentType<any> = DefError) =>
  baseLoadView(moduleName, viewName, options, loading, error);

declare global {
  type APPState = APP['App']['state'];
  type RouteState = APP['App']['state']['route'];
  const App: APP['App'];
  const Modules: APP['Modules'];
  const Project: {clientPublicPath: string};

  // 初始环境变量放在/public/index.html中, 以防止被 webpack 打包
  const initEnv: {
    version: string;
    staticPath: string;
    apiServerPath: {[key: string]: string};
    production: boolean;
  };
}

((data: {[key: string]: any}) => {
  // @ts-ignore
  const g = typeof window === 'undefined' ? global : window;
  Object.keys(data).forEach((key) => {
    g[key] = data[key];
  });
})({App, Modules, Project});
