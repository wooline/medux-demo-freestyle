import {NextFunction, Request, Response} from 'express';
import {GetList} from '@/src/api/comment';

export = function (request: Request, response: Response, next: NextFunction) {
  const result: GetList['Response'] = {
    listSummary: {
      pageCurrent: 1,
      pageSize: 5,
      totalItems: 10,
      totalPages: 2,
    },
    list: [
      {
        id: '11',
        userId: '11',
        username: 'c8959f895ebf',
        avatarUrl: '/client/imgs/admin.jpg',
        content:
          '东北旅游那家好，同程上面找牛导，吃好玩好住得好，没有套路不烦恼！我们已有十来年没有跟过**外出旅游，原因就是套路太多，防不胜防！但是这次的线路另我十分意外！首先是住的好，2天五星级宾馆，2天特色商务酒店，一天雪乡单间暖炕！然后是吃的好，都是东北当地特色美食，正宗，地道！还有玩的好',
        replies: 5,
        createdTime: '1分钟前',
      },
      {
        id: '12',
        userId: '12',
        username: '妮妮妮',
        avatarUrl: '/client/imgs/admin.jpg',
        content:
          '6天的冰雪之旅让人印象深刻！去年就想来哈尔滨了，今年终于过来了，一个字，值！ 1.先说说导游，这次的导游是牛导牛府园，人很帅气，跟我印象里东北汉子一样！人很诙谐幽默，全程讲解的也非常好，给我们介绍了东北文化，也介绍了很多特色美食！4天的行程一直照顾我们，带我们感受了大东北的美丽！',
        replies: 1,
        createdTime: '2分钟前',
      },
      {
        id: '13',
        userId: '13',
        username: '大太阳无敌',
        avatarUrl: '/client/imgs/admin.jpg',
        content:
          '非常感谢牛导，希望下次还有机会参加你带的团！ 2.说说住宿，这五天来的住宿，用的来说还是很不错，第一晚和最后一晚都住在乾呈大酒店，房间不算大，但总体环境还是很不错，中间的一晚温泉酒店，房间很大，设施很齐全，只是早饭不怎么样！3.说说景点，对于第一次来东北的我来说，真的很震撼',
        replies: 23,
        createdTime: '5分钟前',
      },
      {
        id: '14',
        userId: '14',
        username: '139kqvbn577',
        avatarUrl: '/client/imgs/admin.jpg',
        content:
          '一次愉快的冰雪之旅，将东北特色的吃、喝、玩、景几乎全部体验了。品尝东北特色菜、饺子、马迭尔冰棍、列巴……玩各种冰雪项目:雪地摩托、马拉爬犁、滑雪、滑圈……特别是在温泉中欣赏银装素裹的世界，真的是不摆了😍从乡村雪景、山中雪景（包括雾凇、树挂）、茫茫田野、江面冰景到雪雕',
        replies: 1,
        createdTime: '15分钟前',
      },
      {
        id: '15',
        userId: '15',
        username: '自由行走～～',
        avatarUrl: '/client/imgs/admin.jpg',
        content:
          '订这个行程的时候，急急忙忙的订下去，太仓促了，首先就应该把东北装备都买好了，因为旅游区地方卖的东西还是挺贵的，啥羊毛袜子啊，防风手套，雪地帽子，雪地靴！防风服如果没有买这里也可以出租，一天80这样，口罩多买几个，会湿透的，行程时间最好不要太早，定了一个时间9点多飞机，在这里6点多就要出发',
        replies: 0,
        createdTime: '15分钟前',
      },
      {
        id: '16',
        userId: '16',
        username: '自由行走～～',
        avatarUrl: '/client/imgs/admin.jpg',
        content:
          '订这个行程的时候，急急忙忙的订下去，太仓促了，首先就应该把东北装备都买好了，因为旅游区地方卖的东西还是挺贵的，啥羊毛袜子啊，防风手套，雪地帽子，雪地靴！防风服如果没有买这里也可以出租，一天80这样，口罩多买几个，会湿透的，行程时间最好不要太早，定了一个时间9点多飞机，在这里6点多就要出发',
        replies: 0,
        createdTime: '15分钟前',
      },
    ],
  };
  response.json(result);
};
