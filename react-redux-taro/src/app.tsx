import './Global';
import React, {Component} from 'react';
import {useSelector} from 'react-redux';
import {buildApp} from '@medux/react-taro-router';
import {Provider, connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {moduleGetter, locationTransform} from './modules/config';

import 'taro-ui/dist/style/index.scss';
import './assets/css/global.module.less';

let store: any;
class App extends Component {
  constructor(props: any) {
    super(props);
    console.log('app init');
    !store &&
      buildApp(moduleGetter, {locationTransform}, (_store) => {
        store = _store;
      });
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    console.log('app render');
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
