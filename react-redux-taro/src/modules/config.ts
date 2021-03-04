import {createLocationTransform, DeepPartial} from '@medux/react-taro-router';
import photoDefaultRouteParams from '~/modules/photos/meta';
import videosDefaultRouteParams from '~/modules/videos/meta';
import myDefaultRouteParams from '~/modules/my/meta';
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
  app: {},
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
  '/my/summary': {
    argsToParams([pageCurrent, term]: Array<string | undefined>) {
      const pathParams: PartialRouteParams = {app: {}, my: {subView: 'UserSummary'}};
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
};

export type Pagename = keyof typeof pagenameMap;

export const locationTransform = createLocationTransform(defaultRouteParams, pagenameMap, {
  in(nativeLocation) {
    let pathname = nativeLocation.pathname;
    if (pathname === '/' || pathname === '/pages/photo/mainList/index') {
      pathname = '/photos/list';
    } else if (pathname === '/pages/video/mainList/index') {
      pathname = '/videos/list';
    } else if (pathname === '/pages/my/userSummary/index') {
      pathname = '/my/summary';
    }
    return {...nativeLocation, pathname};
  },
  out(nativeLocation) {
    return nativeLocation;
  },
});
