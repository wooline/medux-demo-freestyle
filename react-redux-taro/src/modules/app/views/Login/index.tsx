import React, {useCallback, useState, useEffect} from 'react';
import {Dispatch} from '@medux/react-taro-router';
import {connectRedux} from '@medux/react-taro-router/lib/conect-redux';
import {View} from '@tarojs/components';
import {AtForm, AtInput, AtButton} from 'taro-ui';
import Taro from '@tarojs/taro';
import {CurUser, LoginParams} from '@/src/modules/app/entity';
import {App} from '@/src/Global';
import styles from './index.module.less';

interface StoreProps {
  curUser?: CurUser;
}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}
const {app: appActions} = App.getActions('app');
const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({curUser, dispatch}) => {
  useEffect(() => {
    if (curUser && curUser.hasLogin) {
      App.router.relaunch({pagename: '/my/summary'});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const onCancel = useCallback(() => App.router.back(1, '/my/summary?{}'), []);
  const onSubmit = useCallback(() => {
    const loginParams: LoginParams = {username: username.trim(), password: password.trim()};
    if (!loginParams.username || !loginParams.password) {
      Taro.showToast({title: '请输入用户名和密码', icon: 'none'});
    } else {
      (dispatch(appActions.login(loginParams)) as Promise<void>).catch((e) => {
        setErrorMessage(e.message);
      });
    }
  }, [password, username, dispatch]);
  return (
    <View className={styles.root}>
      <AtForm>
        <AtInput onChange={setUsername as any} name="username" type="text" placeholder="用户名" value={username} />
        <AtInput onChange={setPassword as any} name="password" type="password" placeholder="密码" value={password} />
      </AtForm>
      <View className="control">
        <AtButton type="primary" onClick={onSubmit}>
          登录
        </AtButton>
        <AtButton onClick={onCancel}>取消</AtButton>
      </View>
      {errorMessage && <View className="errorMessage">{errorMessage}</View>}
    </View>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const app = appState.app!;
  return {curUser: app.curUser};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
