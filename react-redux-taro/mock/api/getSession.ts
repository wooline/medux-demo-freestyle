import {NextFunction, Request, Response} from 'express';
import {GetItem} from '@/src/api/session';
import {database} from '../database';

export = function (request: Request, response: Response, next: NextFunction) {
  const result: GetItem['Response'] = database.curUser;
  response.json(result);
};
