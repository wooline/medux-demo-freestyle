import 'Global';
import {buildApp} from '@medux/react-web-router';
import {moduleGetter, locationTransform} from 'modules/config';

// configure({enforceActions: 'never'});

// const todo: any = observable({});

// todo.sayHello = {aaa: {bbb: []}};

buildApp(moduleGetter, {locationTransform}).then(() => {
  const initLoading = document.getElementById('g-init-loading');
  if (initLoading) {
    initLoading.parentNode!.removeChild(initLoading);
  }
});
