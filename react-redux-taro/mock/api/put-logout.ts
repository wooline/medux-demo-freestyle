import {NextFunction, Request, Response} from 'express';
import {database} from '../database';

export = function (request: Request, response: Response, next: NextFunction) {
  database.curUser = database.guest;
  response.json(database.curUser);
};
