import './Global';
import React, {Component} from 'react';
import {buildApp, Store} from '@medux/react-taro-router';
import {Provider} from '@medux/react-taro-router/lib/conect-redux';
import {moduleGetter, locationTransform} from './modules/config';

import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/form.scss';
import './assets/css/global.module.less';

class App extends Component {
  state!: {store: Store};

  constructor(props: any) {
    super(props);
    buildApp(moduleGetter, {locationTransform}, (store: any) => {
      this.state = {store};
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
    return <Provider store={this.state.store}>{this.props.children}</Provider>;
  }
}

export default App;
