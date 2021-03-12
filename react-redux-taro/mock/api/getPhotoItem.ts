import {NextFunction, Request, Response} from 'express';
import {GetItem} from '@/src/api/photo';

export = function (request: Request, response: Response, next: NextFunction) {
  const result: GetItem['Response'] = {
    id: '1',
    title: '新加坡+吉隆坡+马六甲6或7日跟团游',
    departure: '无锡',
    type: '跟团游',
    price: 2499,
    hot: 265,
    comments: 142,
    coverUrl: '/client/imgs/1.jpg',
    remark:
      '就前几天去的，爸妈没去过泰国，所以依然陪他们走完了行程。这次完得很顺心，这次是吸取教训，好几天前就找了闺蜜推荐了泰国的旅游私人定制师阿诺做了行程规划，酒店、景点门票、交通、导游包括保险这些都在很早前阿诺就已经帮我们安排好了，另外还有吃的东西好多也是阿诺给我们推荐的，这几天吃到的东西都很棒。一路上住的地方也都很安静也很舒适。导游讲解可专业也可细心了，玩下来感觉特别好，玩的景点也多，都是必去的。一路下来曼谷、大皇宫、玉佛寺、大城王朝遗址、四方水上市场、人妖表演、从林骑大象、乐趣马车、水果园、格兰岛、首富大庄园、游轮公主号、暹罗风情园、四面佛、KINGPOWER免税店 真正精华的景点阿诺都给我们安排到了。',
    picList: ['/client/imgs/1.jpg', '/client/imgs/2.jpg', '/client/imgs/3.jpg'],
  };
  response.json(result);
};
