import './Global';
import React, {Component} from 'react';
import {buildApp} from '@medux/react-taro-router';
import {Provider} from '@medux/react-taro-router/lib/conect-redux';
import {moduleGetter, locationTransform} from './modules/config';

import './app.less';

let store: any;
class App extends Component {
  constructor(props: any) {
    super(props);
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
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
