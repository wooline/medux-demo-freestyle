import * as AppModule from 'modules/app';
import * as MainLayout from 'modules/mainLayout';
import {createLocationTransform, createPathnameTransform, PagenameMap, DeepPartial} from '@medux/react-web-router';
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

const pathnameIn = (pathname: string) => {
  if (pathname === '/') {
    return '/photos/list';
  }
  return pathname;
};

const pagenameMap = {
  '/photos': {
    in() {
      const pathParams: PartialRouteParams = {app: {}, mainLayout: {}, photos: {}};
      return pathParams;
    },
    out() {
      return [];
    },
  },
  '/photos/list': {
    in([pageCurrent, term]: string[]) {
      const pathParams: PartialRouteParams = {app: {}, mainLayout: {}, photos: {listView: 'list', listSearchPre: {}}};
      if (pageCurrent) {
        pathParams.photos!.listSearchPre!.pageCurrent = parseInt(pageCurrent, 10);
      }
      if (term) {
        pathParams.photos!.listSearchPre!.term = term;
      }
      return pathParams;
    },
    out(params: PartialRouteParams) {
      const {pageCurrent, term} = params.photos?.listSearchPre || {};
      return [pageCurrent, term];
    },
  },
  '/photos/detail': {
    in([itemIdPre]: string[]) {
      const pathParams: PartialRouteParams = {app: {}, mainLayout: {}, photos: {itemView: 'detail', itemIdPre}};
      return pathParams;
    },
    out(params) {
      const {itemIdPre} = params.photos || {};
      return [itemIdPre];
    },
  },
};

export type Pagename = keyof typeof pagenameMap;

export const locationTransform = createLocationTransform(createPathnameTransform(pathnameIn, pagenameMap), defaultRouteParams);
