import {createLocationTransform, DeepPartial} from '@medux/react-taro-router';
import photoDefaultRouteParams from '@/src/modules/photo/meta';
import videoDefaultRouteParams from '@/src/modules/video/meta';
import myDefaultRouteParams from '@/src/modules/my/meta';
import appDefaultRouteParams from '@/src/modules/app/meta';
import commentDefaultRouteParams from '@/src/modules/comment/meta';
import * as App from './app';
import * as Photo from './photo';
import * as Video from './video';
import * as Comment from './comment';
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
  comment: () => {
    return Comment;
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
  comment: commentDefaultRouteParams,
  my: myDefaultRouteParams,
};

export type RouteParams = typeof defaultRouteParams;

type PartialRouteParams = DeepPartial<RouteParams>;

const pagenameMap = {
  '/photo/list': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, photo: {listView: 'list'}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/photo/item': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, photo: {itemView: 'detail'}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/video/list': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, video: {listView: 'list'}};
      return pathParams;
    },
    paramsToArgs(params: PartialRouteParams) {
      return [];
    },
  },
  '/video/item': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, video: {itemView: 'detail'}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/comment/list': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, comment: {listView: 'list'}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/app/login': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {subView: 'Login'}};
      return pathParams;
    },
    paramsToArgs() {
      return [];
    },
  },
  '/my/summary': {
    argsToParams() {
      const pathParams: PartialRouteParams = {app: {}, my: {subView: 'UserSummary'}};
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
    const map = {
      '/': '/photo/list',
      '/pages/photo/mainList/index': '/photo/list',
      '/pages/photo/mainItem/index': '/photo/item',
      '/pages/video/mainList/index': '/video/list',
      '/pages/video/mainItem/index': '/video/item',
      '/pages/comment/mainList/index': '/comment/list',
      '/pages/my/userSummary/index': '/my/summary',
      '/pages/app/login/index': '/app/login',
    };
    const pathname = nativeLocation.pathname;

    return {...nativeLocation, pathname: map[pathname]};
  },
  out(nativeLocation) {
    const map = {
      '/photo/list': '/pages/photo/mainList/index',
      '/photo/item': '/pages/photo/mainItem/index',
      '/video/list': '/pages/video/mainList/index',
      '/video/item': '/pages/video/mainItem/index',
      '/comment/list': '/pages/comment/mainList/index',
      '/my/summary': '/pages/my/userSummary/index',
      '/app/login': '/pages/app/login/index',
    };
    const pathname = nativeLocation.pathname;
    return {...nativeLocation, pathname: map[pathname]};
  },
});
