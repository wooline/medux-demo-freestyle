import React, {PureComponent} from 'react';
import {App} from '~/Global';

const Photos = App.loadView('photos', 'main');

class Page extends PureComponent {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <Photos />;
  }
}

export default Page;
