import React, {useCallback} from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View} from '@tarojs/components';
import {CurUser} from '@/src/modules/app/entity';
import {App} from '@/src/Global';
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({curUser}) => {
  const onLogin = useCallback(() => App.router.push('/app/login?{}'), []);
  return (
    <View className={styles.root}>
      <View className="info">
        <View className="avatar" />

        {curUser.hasLogin ? (
          <>
            <View className="nickName">{curUser.username}</View>
            <View className="score">✆ {curUser.mobile}</View>
          </>
        ) : (
          <View>
            <View className="login" onClick={onLogin}>
              登录
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const app = appState.app!;
  return {curUser: app.curUser};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
