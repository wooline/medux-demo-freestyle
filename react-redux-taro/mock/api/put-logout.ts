import {NextFunction, Request, Response} from 'express';
import {Logout} from '@/src/api/session';
import {database} from '../database';

export = function (request: Request, response: Response, next: NextFunction) {
  database.curUser = database.guest;
  const result: Logout['Response'] = database.curUser;
  response.json(result);
};
