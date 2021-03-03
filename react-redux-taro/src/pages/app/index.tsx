import React, {PureComponent} from 'react';
import {App} from '~/Global';

const MainLayout = App.loadView('app', 'main');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <MainLayout />;
  }
}

export default Page;
