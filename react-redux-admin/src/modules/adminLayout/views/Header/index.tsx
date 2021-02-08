import {Avatar, Badge, Dropdown, Menu} from 'antd';
import {
  BellOutlined,
  CloseCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, {useCallback, useMemo} from 'react';

import {CurUser} from 'modules/app/entity';
import {Link, Dispatch} from '@medux/react-web-router';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import styles from './index.m.less';

interface StoreProps {
  curUser: CurUser;
  siderCollapsed: boolean;
}
interface DispatchProps {
  dispatch: Dispatch;
}

const {app: appActions, adminLayout: adminLayoutActions} = App.getActions('app', 'adminLayout');

const Component: React.FC<StoreProps & DispatchProps> = ({siderCollapsed, curUser, dispatch}) => {
  const onToggleSider = useCallback(() => dispatch(adminLayoutActions.putSiderCollapsed()), [dispatch]);
  const onLogout = useCallback(() => dispatch(appActions.logout()), [dispatch]);
  const onMenuItemClick = useCallback(
    ({key}: {key: any}) => {
      if (key === 'logout') {
        onLogout();
      } else if (key === 'triggerError') {
        setTimeout(() => {
          throw new Error('自定义出错！');
        }, 0);
      }
    },
    [onLogout]
  );
  const menu = useMemo(
    () => (
      <Menu selectedKeys={[]} onClick={onMenuItemClick}>
        <Menu.Item disabled>
          <UserOutlined /> 个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <SettingOutlined /> 设置
        </Menu.Item>
        <Menu.Item key="triggerError">
          <CloseCircleOutlined /> 触发报错
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined /> 退出登录
        </Menu.Item>
      </Menu>
    ),
    [onMenuItemClick]
  );

  return (
    <div className={styles.root}>
      <div className="main">
        {siderCollapsed ? (
          <MenuUnfoldOutlined className="toggleSider" onClick={onToggleSider} />
        ) : (
          <MenuFoldOutlined className="toggleSider" onClick={onToggleSider} />
        )}
        <Link href="#">
          <QuestionCircleOutlined /> 帮助指南
        </Link>
      </div>
      <div className="side">
        <Badge count={12} className="noticeIcon">
          <BellOutlined />
        </Badge>
        <Dropdown overlay={menu}>
          <span className="account">
            <Avatar size="small" className="avatar" src={curUser.avatar} />
            <span>{curUser.username}</span>
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

function mapStateToProps(state: APPState): StoreProps {
  return {
    curUser: state.app!.curUser!,
    siderCollapsed: !!state.adminLayout!.siderCollapsed,
  };
}

export default connectRedux(mapStateToProps)(React.memo(Component));
