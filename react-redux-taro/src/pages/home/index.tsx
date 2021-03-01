import React, {Component} from 'react';
import {View} from '@tarojs/components';
import {App} from '~/Global';

const MainLayout = App.loadView('app', 'main');

class Page extends Component {
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View>
        <MainLayout />
      </View>
    );
  }
}

export default Page;
