import React, {PureComponent} from 'react';
import {connectPage} from '@medux/react-taro-router/lib/conect-redux';
import {App} from '@/src/Global';

const VideosList = App.loadView('videos', 'mainList');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <VideosList />;
  }
}

export default connectPage(Page);
