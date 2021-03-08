import React, {PureComponent} from 'react';
import {App} from '@/src/Global';

const PhotoList = App.loadView('photo', 'mainList');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <PhotoList />;
  }
}

export default Page;
