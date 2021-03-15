import {NextFunction, Request, Response} from 'express';
import {GetList} from '@/src/api/photo';
import {database} from '../database';

export = function (request: Request, response: Response, next: NextFunction) {
  const query: GetList['Request'] = request.query;

  const pageCurrent = parseInt(query.pageCurrent, 10) || 1;
  const pageSize = parseInt(query.pageSize, 10) || 10;

  const start = (pageCurrent - 1) * pageSize;
  const end = start + pageSize;

  const datasource = database.photos;

  const listData = Object.keys(datasource).map((id) => {
    return datasource[id];
  });

  const totalItems = listData.length;

  const result: GetList['Response'] = {
    listSummary: {
      pageCurrent,
      pageSize,
      totalItems,
      totalPages: Math.ceil(listData.length / pageSize),
    },
    list: listData.slice(start, end),
  };
  setTimeout(() => response.json(result), 5000);
  // response.json(result);
};
