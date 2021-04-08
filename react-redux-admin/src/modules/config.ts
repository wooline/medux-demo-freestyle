import * as appModule from 'modules/app';
import * as account from 'modules/account';
import {defaultRouteParams as appRouteParams} from 'modules/app/entity';
import {createLocationTransform, DeepPartial} from '@medux/react-web-router';

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  app: () => {
    return appModule;
  },
  account: () => {
    return account;
  },
  adminLayout: () => {
    return import('modules/adminLayout');
  },
  adminHome: () => {
    return import('modules/admin/adminHome');
  },
};
export type ModuleGetter = typeof moduleGetter;

export const defaultRouteParams = {
  app: appRouteParams,
  account: {},
  adminLayout: {},
  adminHome: {},
};

export type RouteParams = typeof defaultRouteParams;

export type PartialRouteParams = DeepPartial<RouteParams>;

const pagenameMap = {
  '/admin': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, adminLayout: {}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/admin/home': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, adminLayout: {}, adminHome: {}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
};

export type Pagename = keyof typeof pagenameMap;

export const locationTransform = createLocationTransform(defaultRouteParams, pagenameMap, {
  in(nativeLocation) {
    let pathname = nativeLocation.pathname;
    if (pathname === '/') {
      pathname = '/admin/home';
    }
    return {...nativeLocation, pathname};
  },
  out(nativeLocation) {
    return nativeLocation;
  },
});
