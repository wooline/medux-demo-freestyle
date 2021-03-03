import {NextFunction, Request, Response} from 'express';
import {GetVideoList} from '~/api/video';

export = function (request: Request, response: Response, next: NextFunction) {
  const result: GetVideoList['Response'] = {
    listSummary: {
      pageCurrent: 1,
      pageSize: 5,
      totalItems: 10,
      totalPages: 2,
    },
    list: [
      {
        id: '1',
        title: '新加坡+吉隆坡+马六甲6或7日跟团游',
        hot: 265,
        coverUrl: 'imgs/9.jpg',
        videoUrl: 'imgs/9.jpg',
      },
      {
        id: '2',
        title: '芽庄4晚5日跟团游',
        hot: 36,
        coverUrl: 'imgs/10.jpg',
        videoUrl: 'imgs/10.jpg',
      },
      {
        id: '3',
        title: '厦门+鼓浪屿自驾4日游',
        hot: 6895,
        coverUrl: 'imgs/11.jpg',
        videoUrl: 'imgs/11.jpg',
      },
      {
        id: '4',
        title: '住无锡318文化大院，游灵山小镇拈花湾',
        hot: 562,
        coverUrl: 'imgs/12.jpg',
        videoUrl: 'imgs/12.jpg',
      },
      {
        id: '5',
        title: '长沙+张家界森林公园+天门山+玻璃栈道+黄龙洞+凤凰古城双高6日跟团游',
        hot: 882,
        coverUrl: 'imgs/13.jpg',
        videoUrl: 'imgs/13.jpg',
      },
    ],
  };
  response.json(result);
};
