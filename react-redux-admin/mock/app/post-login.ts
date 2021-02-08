import {NextFunction, Request, Response} from 'express';
import {actions, database} from '../global';

export = function (request: Request, response: Response, next: NextFunction) {
  let {username = '', password = '', keep} = request.body;
  username = username.toString();
  password = password.toString();
  keep = Boolean(keep);
  const curUser = database.users[username];
  if (curUser && password === curUser.password) {
    curUser.loginTime = Date.now();
    const token = actions.createToken(username, keep ? '7d' : '1d');
    response.json({...curUser, hasLogin: true, token});
  } else {
    response.status(422).json({
      message: '用户名或密码错误！',
    });
  }
};
