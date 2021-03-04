import React, {PureComponent} from 'react';
import {connectPage} from '@medux/react-taro-router/lib/conect-redux';
import {App} from '~/Global';

const UserSummary = App.loadView('my', 'userSummary');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <UserSummary />;
  }
}

export default connectPage(Page);
