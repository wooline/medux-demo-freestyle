import 'Global';
import {buildApp} from '@medux/react-web-router';
import {moduleGetter, locationTransform} from 'modules/config';
import 'assets/css/global.m.less';

buildApp(moduleGetter, {locationTransform}).then(() => {
  const initLoading = document.getElementById('g-init-loading');
  if (initLoading) {
    initLoading.parentNode!.removeChild(initLoading);
  }
});
