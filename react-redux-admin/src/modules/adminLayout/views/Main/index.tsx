import React from 'react';
import {Else} from '@medux/react-web-router';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import {Layout, Result} from 'antd';
import Navs from '../Navs';
import Header from '../Header';
import Flag from '../Flag';
import styles from './index.m.less';

const AdminHome = App.loadView('adminHome', 'main');
const V404 = <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />;

interface StoreProps {
  subView: RouteState['params'];
  siderCollapsed: boolean;
}
interface OwnerProps {}
interface DispatchProps {}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({subView, siderCollapsed}) => {
  return (
    <Layout className={styles.root}>
      <Layout.Sider className="g-scrollBar" trigger={null} collapsible collapsed={siderCollapsed}>
        <Flag />
        <Navs singleOpen />
      </Layout.Sider>
      <Layout>
        <Layout.Header>
          <Header />
        </Layout.Header>
        <Layout.Content>
          <Else elseView={V404}>{subView.adminHome && <AdminHome />}</Else>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  const thisModule = appState.adminLayout!;
  return {subView: appState.route.params, siderCollapsed: !!thisModule.siderCollapsed};
}

export default connectRedux(mapStateToProps)(React.memo(Component));
