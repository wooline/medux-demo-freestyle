import {NextFunction, Request, Response} from 'express';

export = function (request: Request, response: Response, next: NextFunction) {
  response.status(404).end();
};
