import {NextFunction, Request, Response} from 'express';
import {GetPhotoList} from '~/api/photo';

export = function (request: Request, response: Response, next: NextFunction) {
  const result: GetPhotoList['Response'] = {
    listSummary: {
      pageCurrent: 1,
      pageSize: 5,
      totalItems: 10,
      totalPages: 2,
    },
    list: [
      {
        id: '1',
        title: '新加坡+吉隆坡+马六甲6或7日跟团游555555',
        departure: '无锡',
        type: '跟团游',
        price: 2499,
        hot: 265,
        coverUrl: '/client/imgs/1.jpg',
      },
      {
        id: '2',
        title: '芽庄4晚5日跟团游',
        departure: '常州',
        type: '跟团游',
        price: 1582,
        hot: 36,
        coverUrl: '/client/imgs/2.jpg',
      },
      {
        id: '3',
        title: '厦门+鼓浪屿自驾4日游',
        departure: '苏州',
        type: '自驾游',
        price: 800,
        hot: 6895,
        coverUrl: '/client/imgs/3.jpg',
      },
      {
        id: '4',
        title: '住无锡318文化大院，游灵山小镇拈花湾',
        departure: '无锡',
        type: '自助游',
        price: 6581,
        hot: 562,
        coverUrl: '/client/imgs/4.jpg',
      },
      {
        id: '5',
        title: '长沙+张家界森林公园+天门山+玻璃栈道+黄龙洞+凤凰古城双高6日跟团游',
        departure: '长沙',
        type: '跟团游',
        price: 3075,
        hot: 882,
        coverUrl: '/client/imgs/5.jpg',
      },
    ],
  };
  response.json(result);
};
