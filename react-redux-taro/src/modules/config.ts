import {createLocationTransform, DeepPartial} from '@medux/react-taro-router';
import photoDefaultRouteParams from '~/modules/photos/meta';
import * as App from './app';
import * as Photos from './photos';

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  app: () => {
    return App;
  },
  photos: () => {
    return Photos;
  },
};
export type ModuleGetter = typeof moduleGetter;

export const defaultRouteParams = {
  app: {},
  photos: photoDefaultRouteParams,
};

export type RouteParams = typeof defaultRouteParams;

type PartialRouteParams = DeepPartial<RouteParams>;

const pagenameMap = {
  '/photos': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, photos: {}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/photos/list': {
    argsToParams([pageCurrent, term]: Array<string | undefined>) {
      const pathParams: PartialRouteParams = {app: {}, photos: {listView: 'list', listSearchPre: {}}};
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
};

export type Pagename = keyof typeof pagenameMap;

export const locationTransform = createLocationTransform(defaultRouteParams, pagenameMap, {
  in(nativeLocation) {
    let pathname = nativeLocation.pathname;
    if (pathname === '/' || pathname === '/pages/home/index') {
      pathname = '/photos/list';
    }
    return {...nativeLocation, pathname};
  },
  out(nativeLocation) {
    return nativeLocation;
  },
});
