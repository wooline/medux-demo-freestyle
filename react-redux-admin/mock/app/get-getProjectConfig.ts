import {NextFunction, Request, Response} from 'express';
import {ProjectConfig} from '~/api/app';

export = function (request: Request, response: Response, next: NextFunction) {
  const result: ProjectConfig = {noticeTimer: 10};
  response.json(result);
};
