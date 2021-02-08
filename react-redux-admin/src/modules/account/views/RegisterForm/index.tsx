import React, {useCallback} from 'react';
import {Button, Checkbox, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Dispatch} from '@medux/react-web-router';
import {connectRedux} from '@medux/react-web-router/lib/conect-redux';
import {getFormDecorators} from 'common/utils';
import {RegisterParams} from '../../entity';
import styles from './index.m.less';

interface StoreProps {}
interface OwnerProps {}
interface DispatchProps {
  dispatch: Dispatch;
}

interface FormData extends Required<RegisterParams> {
  confirm: string;
  agreement: boolean;
}

const initialValues: Partial<FormData> = {
  username: '',
  password: '',
  confirm: '',
  agreement: false,
};

const agreementChecked = (rule: any, value: string) => {
  if (!value) {
    return Promise.reject('您必须同意注册协议!');
  }
  return Promise.resolve();
};
const fromDecorators = getFormDecorators<FormData>({
  username: {rules: [{required: true, message: '请输入用户名!'}]},
  password: {rules: [{required: true, message: '请输入密码!'}]},
  confirm: {
    rules: [
      {required: true, message: '请再次输入密码!'},
      ({getFieldValue}) => ({
        validator(rule, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject('2次密码输入不一至!');
        },
      }),
    ],
    dependencies: ['password'],
  },
  agreement: {valuePropName: 'checked', rules: [{validator: agreementChecked}]},
});

const userOutlined = <UserOutlined />;
const lockOutlined = <LockOutlined />;
const lockOutlined2 = <LockOutlined />;

const Component: React.FC<StoreProps & DispatchProps & OwnerProps> = ({dispatch}) => {
  const onNavToLogin = useCallback(() => dispatch(Modules.app.actions.navToAccount('login')), [dispatch]);

  const [form] = Form.useForm();
  const onFinish = useCallback(
    (values: FormData) => {
      console.log(form);
      // onRegister(values).catch((err) => {
      //   form.setFields([{name: 'password', errors: [err.message]}]);
      // });
    },
    [form]
  );
  return (
    <div className={styles.root}>
      <h2>注册新用户</h2>
      <Form form={form} onFinish={onFinish as any} initialValues={initialValues}>
        <Form.Item {...fromDecorators.username}>
          <Input size="large" prefix={userOutlined} placeholder="用户名" />
        </Form.Item>
        <Form.Item {...fromDecorators.password}>
          <Input size="large" prefix={lockOutlined} type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item {...fromDecorators.confirm}>
          <Input size="large" prefix={lockOutlined2} type="password" placeholder="确认密码" />
        </Form.Item>
        <Form.Item>
          <Button size="large" type="default" className="btns" onClick={onNavToLogin}>
            返回登录
          </Button>
          <Button size="large" type="primary" htmlType="submit" className="btns">
            提交注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connectRedux()(React.memo(Component));
