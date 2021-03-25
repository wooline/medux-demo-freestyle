import {NextFunction, Request, Response} from 'express';
import {GetList} from '@/src/api/photo';
import {database} from '../database';

export = function (request: Request, response: Response, next: NextFunction) {
  const query: GetList['Request'] = request.query;

  const pageSize = parseInt(query.pageSize, 10) || 10;
  const pageCurrent = query.pageCurrent
    .split(',', 2)
    .map((item) => parseInt(item, 10))
    .filter(Boolean);
  const datasource = database.photos;
  const listData = Object.keys(datasource).map((id) => {
    return datasource[id];
  });
  const totalItems = listData.length;
  const pageList = pageCurrent.map((page) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return listData.slice(start, end);
  });

  const result: GetList['Response'] = {
    listSummary: {
      pageCurrent: pageCurrent[1] ? [pageCurrent[0], pageCurrent[1]] : pageCurrent[0],
      pageSize,
      totalItems,
      totalPages: Math.ceil(listData.length / pageSize),
      firstSize: pageList[0].length,
    },
    list: pageList[1] ? pageList[0].concat(pageList[1]) : pageList[0],
  };
  // setTimeout(() => response.json(result), 5000);
  response.json(result);
};
