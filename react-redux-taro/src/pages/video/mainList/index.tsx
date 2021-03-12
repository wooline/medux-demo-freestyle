import React, {PureComponent} from 'react';
import {App} from '@/src/Global';
import config from './index.config';

const CommonPage = App.loadView('app', 'commonPage');
const VideoList = App.loadView('video', 'mainList');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <CommonPage title={config.navigationBarTitleText}>
        <VideoList />
      </CommonPage>
    );
  }
}

export default Page;
