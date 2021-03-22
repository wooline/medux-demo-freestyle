import React, {PureComponent} from 'react';
import {App} from '@/src/Global';
import config from './index.config';

const CommonPage = App.loadView('app', 'commonPage');
const VideoItem = App.loadView('video', 'mainItem');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <CommonPage title={config.navigationBarTitleText}>sdfsfsf</CommonPage>;
  }
}

export default Page;
