import React, {useCallback} from 'react';
import {Button, Checkbox, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Dispatch} from '@medux/react-web-router';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import {getFormDecorators} from 'common/utils';
import {metaKeys} from 'common/meta';
import {LoginParams, CurUser} from 'modules/app/entity';
import FormLayout from '../../components/FormLayout';
import styles from './index.m.less';

type FormData = Required<LoginParams>;
const initialValues: Partial<FormData> = {
  username: 'admin',
  password: '',
  keep: false,
};

const fromDecorators = getFormDecorators<FormData>({
  username: {rules: [{required: true, message: '请输入用户名!', whitespace: true}]},
  password: {rules: [{required: true, message: '请输入密码!', whitespace: true}]},
  keep: {valuePropName: 'checked'},
});

const userOutlined = <UserOutlined />;
const lockOutlined = <LockOutlined />;

const {app: appActions} = App.getActions('app');

interface StoreProps {
  curUser: CurUser;
}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({curUser, dispatch}) => {
  const onLogin = useCallback(
    (args: LoginParams) => {
      return dispatch(appActions.login(args)) as Promise<void>;
    },
    [dispatch]
  );
  const onRegister = useCallback(() => dispatch(appActions.navToAccount('register')), [dispatch]);
  const onLogout = useCallback(() => dispatch(appActions.logout()), [dispatch]);
  const navToUserHome = useCallback(() => App.router.push(metaKeys.UserHomePathname), []);
  const [form] = Form.useForm();
  const onFinish = useCallback(
    (values: FormData) => {
      onLogin(values).catch((err) => {
        form.setFields([{name: 'password', errors: [err.message]}]);
      });
    },
    [form, onLogin]
  );
  return (
    <FormLayout>
      <div className={styles.root}>
        <h2 className="title">用户登录</h2>

        {curUser.hasLogin ? (
          <Form form={form} className="hasLogin">
            <p>
              亲爱的{' '}
              <span className="link" onClick={navToUserHome}>
                {curUser.username}
              </span>
              ，您已登录，是否要退出当前登录？
            </p>
            <Button size="large" type="primary" onClick={onLogout} className="submit">
              退出当前登录
            </Button>
          </Form>
        ) : (
          <Form form={form} onFinish={onFinish as any} initialValues={initialValues}>
            <Form.Item {...fromDecorators.username}>
              <Input size="large" allowClear prefix={userOutlined} placeholder="用户名" />
            </Form.Item>
            <Form.Item {...fromDecorators.password}>
              <Input size="large" allowClear prefix={lockOutlined} type="password" placeholder="密码" />
            </Form.Item>
            <Form.Item style={{marginBottom: 0}}>
              <Form.Item {...fromDecorators.keep} noStyle>
                <Checkbox>自动登录</Checkbox>
              </Form.Item>
              <span className="register link" onClick={onRegister}>
                注册新用户
              </span>
              <Button size="large" type="primary" htmlType="submit" className="submit">
                立即登录
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </FormLayout>
  );
};

function mapStateToProps(appState: APPState): StoreProps {
  return {
    curUser: appState.app!.curUser,
  };
}

export default connectRedux(mapStateToProps)(React.memo(Component));
