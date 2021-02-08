/* eslint-disable no-multi-assign */
import * as mockjs from 'mockjs';
import * as jwt from 'jsonwebtoken';
import {Request} from 'express';

const timestamp = Date.now();

function createUsers() {
  const list = {
    superadmin: {
      id: 'superadmin',
      username: 'superadmin',
      nickname: '张三',
      password: '123456',
      gender: 'unknow',
      post: 2,
      roleId: '1',
      roleName: '超级管理员',
      status: 'enable',
      loginTime: timestamp,
      createdTime: timestamp,
      email: 'wooline@qq.com',
      avatar: '/client/imgs/u1.jpg',
      fixed: true,
    },
    admin: {
      id: 'admin',
      username: 'admin',
      nickname: '李四',
      password: '123456',
      gender: 'unknow',
      post: 1,
      roleId: '2',
      roleName: '普通管理员',
      status: 'enable',
      loginTime: timestamp,
      createdTime: timestamp,
      email: 'abcde@qq.com',
      avatar: '/client/imgs/u1.jpg',
      fixed: true,
    },
    editor: {
      id: 'editor',
      username: 'editor',
      nickname: '莉莉',
      password: '123456',
      gender: 'female',
      post: 0,
      roleId: '3',
      roleName: '信息编辑',
      status: 'enable',
      loginTime: timestamp,
      createdTime: timestamp,
      email: 'revvc@sina.com.cn',
      fixed: true,
    },
    editor2: {
      id: 'editor2',
      username: 'editor2',
      nickname: '张小明',
      password: '123456',
      gender: 'female',
      post: 0,
      roleId: '3',
      roleName: '信息编辑',
      status: 'enable',
      loginTime: timestamp,
      createdTime: timestamp,
      email: '5564@sina.com.cn',
      fixed: true,
    },
    member: {
      id: 'member',
      username: 'member',
      nickname: '小明',
      password: '123456',
      gender: 'female',
      post: 2,
      roleId: '4',
      roleName: '普通会员',
      status: 'enable',
      loginTime: timestamp,
      createdTime: timestamp,
      email: 'xiaomin@qq.com',
      fixed: true,
    },
  };
  mockjs
    .mock({
      'list|25': [
        {
          'id|+1': 1,
          username: '@last',
          nickname: '@cname',
          password: '123456',
          'gender|1': ['male', 'female', 'unknow'],
          post: 0,
          roleId: '4',
          roleName: '普通会员',
          'status|1': ['enable', 'disable', 'enable'],
          loginTime: timestamp,
          createdTime: timestamp,
          avatar: '/client/imgs/u1.jpg',
          email: '@email',
        },
      ],
    })
    .list.forEach((item) => {
      item.loginTime = item.createdTime = timestamp + item.id * 1000;
      item.id = item.username += item.id;
      list[item.id] = item;
    });
  return list;
}
export const database = {
  config: {
    tokenRenewalTime: 60,
  },
  roles: {
    1: {
      id: '1',
      roleName: '超级管理员',
      owner: 1,
      fixed: true,
      remark: '系统内置，不可修改',
      createdTime: timestamp,
    },
    2: {
      id: '2',
      roleName: '普通管理员',
      owner: 1,
      fixed: true,
      remark: '系统内置，不可修改',
      createdTime: timestamp,
    },
    3: {
      id: '3',
      roleName: '信息编辑',
      owner: 2,
      fixed: true,
      remark: '系统内置，不可修改',
      createdTime: timestamp,
    },
    4: {
      id: '4',
      roleName: '普通会员',
      owner: 26,
      fixed: true,
      remark: '系统内置，不可修改',
      createdTime: timestamp,
    },
  },
  users: createUsers(),
};
const secretKey = timestamp.toString();
export const actions = {
  createToken(username: string, expiresIn: string) {
    return jwt.sign({username}, secretKey, {expiresIn});
  },
  verifyToken(request: Request) {
    let result: {username: string; code: 'Active' | 'Invalid' | 'Renewal'} = {
      code: 'Invalid',
      username: '',
    };
    const token = request.get('Authorization');
    if (token) {
      try {
        const {username, iat, exp} = jwt.verify(token, secretKey);
        const since = exp - Date.now() / 1000;
        if (since < database.config.tokenRenewalTime) {
          result = {
            code: 'Renewal',
            username,
          };
        } else {
          result = {
            code: 'Active',
            username,
          };
        }
      } catch (err) {
        return result;
      }
    }
    return result;
  },
};
