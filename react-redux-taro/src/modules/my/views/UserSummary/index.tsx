import React from 'react';
import {Switch, Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View, Image} from '@tarojs/components';
import {CurUser} from '~/modules/app/entity';
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({curUser}) => {
  return (
    <View className={styles.root}>
      <View className="info">
        <View className="avatar" />
        <View className="nickName">{curUser.username}</View>
        <View className="score">✆ {curUser.mobile}, VIP</View>
      </View>
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const app = appState.app!;
  return {curUser: app.curUser};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
