import React from 'react';
import {ConfigProvider, Result} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import {Switch} from '@medux/react-web-router';
import {connectRedux, Provider} from '@medux/react-web-router/lib/conect-redux';
import GlobalLoading from 'components/GlobalLoading';
import {CurUser, AccountView} from '../entity';
import 'assets/css/global.m.less';
import 'assets/css/override.less';
import styles from './index.m.less';

const AdminLayout = App.loadView('adminLayout', 'main');
const LoginForm = App.loadView('account', 'loginForm');
const RegisterForm = App.loadView('account', 'registerForm');
const V404 = <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />;
const V403 = <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />;
interface StoreProps {
  curUser: CurUser;
  accountView?: AccountView;
  subView: RouteState['params'];
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({accountView, subView, curUser}) => {
  return (
    <ConfigProvider locale={zhCN}>
      {accountView && !curUser.hasLogin && (
        <div className={styles.dialog}>
          {accountView === 'login' && <LoginForm />}
          {accountView === 'register' && <RegisterForm />}
        </div>
      )}
      <Switch elseView={V404}>{subView.adminLayout && (curUser.hasLogin ? <AdminLayout /> : V403)}</Switch>
      <GlobalLoading />
    </ConfigProvider>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.app!;
  const {accountView} = thisModule;
  return {subView: appState.route.params, accountView, curUser: thisModule.curUser};
}

const APP = connectRedux(mapStateToProps)(React.memo(Component));

export default function Root({store}) {
  return (
    <Provider store={store}>
      <APP />
    </Provider>
  );
}
