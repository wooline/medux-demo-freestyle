import React, {PureComponent} from 'react';
import {App} from '@/src/Global';
import config from './index.config';

const CommonPage = App.loadView('app', 'commonPage');
const CommentList = App.loadView('comment', 'mainList');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <CommonPage title={config.navigationBarTitleText}>
        <CommentList />
      </CommonPage>
    );
  }
}

export default Page;
