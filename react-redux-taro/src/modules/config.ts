import {createLocationTransform, DeepPartial} from '@medux/react-taro-router';
import photoDefaultRouteParams from '@/src/modules/photo/meta';
import videoDefaultRouteParams from '@/src/modules/video/meta';
import myDefaultRouteParams from '@/src/modules/my/meta';
import appDefaultRouteParams from '@/src/modules/app/meta';
import * as App from './app';
import * as Photo from './photo';
import * as Video from './video';
import * as My from './my';

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  app: () => {
    return App;
  },
  photo: () => {
    return Photo;
  },
  video: () => {
    return Video;
  },
  my: () => {
    return My;
  },
};
export type ModuleGetter = typeof moduleGetter;

export const defaultRouteParams = {
  app: appDefaultRouteParams,
  photo: photoDefaultRouteParams,
  video: videoDefaultRouteParams,
  my: myDefaultRouteParams,
};

export type RouteParams = typeof defaultRouteParams;

type PartialRouteParams = DeepPartial<RouteParams>;

const pagenameMap = {
  '/photo/list': {
    argsToParams([pageCurrent, term]: Array<string | undefined>) {
      const pathParams: PartialRouteParams = {app: {}, photo: {listView: 'list', listSearchPre: {}}};
      if (pageCurrent) {
        pathParams.photo!.listSearchPre!.pageCurrent = parseInt(pageCurrent, 10);
      }
      if (term) {
        pathParams.photo!.listSearchPre!.term = term;
      }
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      const {pageCurrent, term} = params.photo?.listSearchPre || {};
      return [pageCurrent, term];
    },
  },
  '/video/list': {
    argsToParams([pageCurrent, term]: Array<string | undefined>) {
      const pathParams: PartialRouteParams = {app: {}, video: {listView: 'list', listSearchPre: {}}};
      if (pageCurrent) {
        pathParams.video!.listSearchPre!.pageCurrent = parseInt(pageCurrent, 10);
      }
      if (term) {
        pathParams.video!.listSearchPre!.term = term;
      }
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      const {pageCurrent, term} = params.video?.listSearchPre || {};
      return [pageCurrent, term];
    },
  },
  '/app/login': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {subView: 'Login'}};
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      const {pageCurrent, term} = params.video?.listSearchPre || {};
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
      '/': '/photo/list',
      '/pages/photo/mainList/index': '/photo/list',
      '/pages/video/mainList/index': '/video/list',
      '/pages/my/userSummary/index': '/my/summary',
      '/pages/app/login/index': '/app/login',
    };
    const pathname = nativeLocation.pathname;

    return {...nativeLocation, pathname: map[pathname]};
  },
  out(nativeLocation) {
    const map = {
      '/photo/list': '/pages/photo/mainList/index',
      '/video/list': '/pages/video/mainList/index',
      '/my/summary': '/pages/my/userSummary/index',
      '/app/login': '/pages/app/login/index',
    };
    const pathname = nativeLocation.pathname;
    return {...nativeLocation, pathname: map[pathname]};
  },
});
