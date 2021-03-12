import React, {PureComponent} from 'react';
import {App} from '@/src/Global';
import config from './index.config';

const CommonPage = App.loadView('app', 'commonPage');
const PhotoItem = App.loadView('photo', 'mainItem');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <CommonPage title={config.navigationBarTitleText}>
        <PhotoItem />
      </CommonPage>
    );
  }
}

export default Page;
