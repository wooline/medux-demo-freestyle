import * as AppModule from 'modules/app';
import * as MainLayout from 'modules/mainLayout';
import {createLocationTransform, DeepPartial} from '@medux/react-web-router';
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

type PartialRouteParams = DeepPartial<RouteParams>;

function redirectOnServer(url: string) {
  App.response.redirect(301, url);
  throw 'redirect';
}

const pagenameMap = {
  '/photos': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, mainLayout: {}, photos: {}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/photos/list': {
    argsToParams([pageCurrent, term]: Array<string | undefined>) {
      const pathParams: PartialRouteParams = {app: {}, mainLayout: {}, photos: {listView: 'list', listSearchPre: {}}};
      if (pageCurrent) {
        pathParams.photos!.listSearchPre!.pageCurrent = parseInt(pageCurrent, 10);
      }
      if (term) {
        pathParams.photos!.listSearchPre!.term = term;
      }
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      const {pageCurrent, term} = params.photos?.listSearchPre || {};
      return [pageCurrent, term];
    },
  },
  '/photos/detail': {
    argsToParams([itemIdPre]: Array<string | undefined>) {
      const pathParams: PartialRouteParams = {app: {}, mainLayout: {}, photos: {itemView: 'detail', itemIdPre}};
      return pathParams;
    },
    paramsToArgs(params) {
      const {itemIdPre} = params.photos || {};
      return [itemIdPre];
    },
  },
};

export type Pagename = keyof typeof pagenameMap;

export const locationTransform = createLocationTransform(defaultRouteParams, pagenameMap, {
  in(nativeLocation) {
    let pathname = nativeLocation.pathname;
    if (pathname === '/') {
      App.response && redirectOnServer('/photos/list');
      pathname = '/photos/list';
    }
    return {...nativeLocation, pathname};
  },
  out(nativeLocation) {
    return nativeLocation;
  },
});
