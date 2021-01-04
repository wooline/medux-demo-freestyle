import * as AppModule from 'modules/app';
import * as MainLayout from 'modules/mainLayout';
import {createWebLocationTransform, PathnameRules, isServer} from '@medux/react-web-router';

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  app: () => {
    return AppModule;
  },
  mainLayout: () => {
    return MainLayout;
  },
  photos: () => {
    return import('modules/photos');
  },
};
export type ModuleGetter = typeof moduleGetter;

export const defaultRouteParams = {
  app: {},
  mainLayout: {},
  photos: {},
};
export type RouteParams = typeof defaultRouteParams;

function redirectOnServer(url: string) {
  App.response.redirect(301, url);
  throw 'redirect';
}

const pathnameRules: PathnameRules<RouteParams> = {
  '/$': () => {
    App.response && redirectOnServer('/photos');
    return '/photos';
  },
  '/:page(photos|videos|myCenter)$': ({page}: {page: string}, params) => {
    params.app = {};
    params.mainLayout = {};
    params[page] = {};
  },
};

export const locationTransform = createWebLocationTransform(defaultRouteParams, pathnameRules, true);
