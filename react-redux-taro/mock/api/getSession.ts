import {NextFunction, Request, Response} from 'express';
import {database} from '../database';

export = function (request: Request, response: Response, next: NextFunction) {
  response.json(database.curUser);
};
