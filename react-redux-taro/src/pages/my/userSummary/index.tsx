import React, {PureComponent} from 'react';
import {connectPage} from '@medux/react-taro-router/lib/conect-redux';
import {App} from '@/src/Global';
import config from './index.config';

const CommonPage = App.loadView('app', 'commonPage');
const UserSummary = App.loadView('my', 'userSummary');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <CommonPage title={config.navigationBarTitleText}>
        <UserSummary />
      </CommonPage>
    );
  }
}

export default connectPage(Page);
