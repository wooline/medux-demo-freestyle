import React, {PureComponent} from 'react';
import {connectPage} from '@medux/react-taro-router/lib/conect-redux';
import {App} from '~/Global';

const Videos = App.loadView('videos', 'main');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <Videos />;
  }
}

export default connectPage(Page);
