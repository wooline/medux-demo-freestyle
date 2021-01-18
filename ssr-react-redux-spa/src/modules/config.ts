import * as AppModule from 'modules/app';
import * as MainLayout from 'modules/mainLayout';
import {createWebLocationTransform, PathnameRules} from '@medux/react-web-router';
import photoDefaultRouteParams from 'modules/photos/meta';

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
  photos: photoDefaultRouteParams,
};

export type RouteParams = typeof defaultRouteParams;

function redirectOnServer(url: string) {
  App.response.redirect(301, url);
  throw 'redirect';
}

const pathnameRules: PathnameRules<RouteParams> = {
  '/$': () => {
    App.response && redirectOnServer('/photos/list');
    return '/photos/list';
  },
  '/:page(photos|videos)$': ({page}: {page: string}) => {
    App.response && redirectOnServer(`/${page}/list`);
    return `/${page}/list`;
  },
  '/:page(photos|videos)/:view': ({page, view}: {page: string; view: string}, params) => {
    params.app = {};
    params.mainLayout = {};
    params[page] = {};
    return {
      $: () => {
        params[page].listView = view;
      },
      '/:id': ({id}: {id: string}) => {
        params[page].itemView = view;
        params[page].itemIdPre = id;
      },
    };
  },
  '/': () => {
    App.response && redirectOnServer('/client/404.html');
    return '/client/404.html';
  },
};

export const locationTransform = createWebLocationTransform(defaultRouteParams, pathnameRules, true);
