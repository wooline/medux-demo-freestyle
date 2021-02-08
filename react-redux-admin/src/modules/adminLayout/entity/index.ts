export interface MenuItem {
  name: string;
  icon?: string;
  keys: string | string[];
  link?: string;
  children?: MenuItem[];
  target?: string;
  disable?: boolean;
}
export interface TabNav {
  id: string;
  title: string;
  url: string;
}

export class API {
  public getMenuData(): Promise<MenuItem[]> {
    return Promise.resolve([
      {
        name: '概要总览',
        icon: 'dashboard',
        keys: '/admin/home',
      },
      {
        name: '用户管理',
        icon: 'user',
        keys: 'member',
        children: [
          {
            name: '用户列表',
            keys: ['/admin/adminMember/:view'],
            link: '/admin/adminMember/list',
          },
        ],
      },
      {
        name: '信息管理',
        icon: 'post',
        keys: '/admin/finance',
        children: [{name: '信息列表', keys: ['/admin/post/list', '/admin/post/list/detail/:id'], link: '/admin/post/list'}],
      },
      {
        name: '性能监控',
        icon: 'post',
        keys: 'monitor',
        children: [{name: '日志列表', keys: ['/monitor/list', '/monitor/detail/:id'], link: '/monitor/list'}],
      },
    ]);
  }
}

export const api = new API();
