import React, {PureComponent} from 'react';
import {App} from '@/src/Global';

const PhotosList = App.loadView('photos', 'mainList');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <PhotosList />;
  }
}

export default Page;
