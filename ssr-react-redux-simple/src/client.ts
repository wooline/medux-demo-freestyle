import 'Global';
import {buildApp} from '@medux/react-web-router';
import {moduleGetter, locationTransform} from 'modules/config';

import {makeAutoObservable, autorun} from 'mobx';

class Todo {
  secondsPassed = {aaa: {bbb: 100}};

  constructor() {
    makeAutoObservable(this);
  }
}
const todo: any = new Todo();

console.log(JSON.stringify(todo));

buildApp(moduleGetter, {locationTransform}).then(() => {
  const initLoading = document.getElementById('g-init-loading');
  if (initLoading) {
    initLoading.parentNode!.removeChild(initLoading);
  }
});
