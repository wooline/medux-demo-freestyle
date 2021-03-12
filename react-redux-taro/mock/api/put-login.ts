import {NextFunction, Request, Response} from 'express';
import {Login} from '@/src/api/session';
import {database} from '../database';

export = function (request: Request, response: Response, next: NextFunction) {
  let {username = '', password = ''}: Login['Request'] = request.body;
  username = username.toString();
  password = password.toString();
  if (username === 'admin' && password === '123456') {
    database.curUser = database.adminUser;
    response.json(database.curUser);
  } else {
    response.status(422).json({
      message: '用户名或密码错误！',
    });
  }
};
