import {NextFunction, Request, Response} from 'express';
import {actions, database} from '../global';

export = function (request: Request, response: Response, next: NextFunction) {
  const {code, username} = actions.verifyToken(request);
  if (code === 'Invalid') {
    response.status(404).end();
  } else {
    const user = {...database.users[username], hasLogin: true};
    if (code === 'Renewal') {
      response.setHeader('x-refresh', 1);
    }
    response.json(user);
  }
};
