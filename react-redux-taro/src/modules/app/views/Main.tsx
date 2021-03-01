import React from 'react';
import {Switch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View} from '@tarojs/components';
import NotFound from '~/components/NotFound';
import {App} from '~/Global';
import styles from './index.module.less';

interface StoreProps {
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Photos = App.loadView('photos', 'main');

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView}) => {
  console.log(subView);
  return (
    <View className={styles.root}>
      <Switch elseView={<NotFound />}>{subView.photos && <Photos />}</Switch>
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {subView: appState.route.params};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
