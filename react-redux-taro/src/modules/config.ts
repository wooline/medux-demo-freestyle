import {createLocationTransform, DeepPartial} from '@medux/react-taro-router';
import photoDefaultRouteParams from '@/src/modules/photos/meta';
import videosDefaultRouteParams from '@/src/modules/videos/meta';
import myDefaultRouteParams from '@/src/modules/my/meta';
import appDefaultRouteParams from '@/src/modules/app/meta';
import * as App from './app';
import * as Photos from './photos';
import * as Videos from './videos';
import * as My from './my';

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  app: () => {
    return App;
  },
  photos: () => {
    return Photos;
  },
  videos: () => {
    return Videos;
  },
  my: () => {
    return My;
  },
};
export type ModuleGetter = typeof moduleGetter;

export const defaultRouteParams = {
  app: appDefaultRouteParams,
  photos: photoDefaultRouteParams,
  videos: videosDefaultRouteParams,
  my: myDefaultRouteParams,
};

export type RouteParams = typeof defaultRouteParams;

type PartialRouteParams = DeepPartial<RouteParams>;

const pagenameMap = {
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
  '/videos/list': {
    argsToParams([pageCurrent, term]: Array<string | undefined>) {
      const pathParams: PartialRouteParams = {app: {}, videos: {listView: 'list', listSearchPre: {}}};
      if (pageCurrent) {
        pathParams.videos!.listSearchPre!.pageCurrent = parseInt(pageCurrent, 10);
      }
      if (term) {
        pathParams.videos!.listSearchPre!.term = term;
      }
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      const {pageCurrent, term} = params.videos?.listSearchPre || {};
      return [pageCurrent, term];
    },
  },
  '/app/login': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {subView: 'Login'}};
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      const {pageCurrent, term} = params.videos?.listSearchPre || {};
      return [pageCurrent, term];
    },
  },
  '/my/summary': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, my: {subView: 'UserSummary'}};
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      return [];
    },
  },
};

export type Pagename = keyof typeof pagenameMap;

export const locationTransform = createLocationTransform(defaultRouteParams, pagenameMap, {
  in(nativeLocation) {
    const map = {
      '/': '/photos/list',
      '/pages/photo/mainList/index': '/photos/list',
      '/pages/video/mainList/index': '/videos/list',
      '/pages/my/userSummary/index': '/my/summary',
      '/pages/app/login/index': '/app/login',
    };
    const pathname = nativeLocation.pathname;

    return {...nativeLocation, pathname: map[pathname]};
  },
  out(nativeLocation) {
    const map = {
      '/photos/list': '/pages/photo/mainList/index',
      '/videos/list': '/pages/video/mainList/index',
      '/my/summary': '/pages/my/userSummary/index',
      '/app/login': '/pages/app/login/index',
    };
    const pathname = nativeLocation.pathname;
    return {...nativeLocation, pathname: map[pathname]};
  },
});
