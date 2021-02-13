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
  title: string;
  url: string;
}

export class API {
  public getMenuData(): Promise<MenuItem[]> {
    return Promise.resolve([
      {
        name: '概要总览',
        keys: '/admin/home',
      },
      {
        name: '用户管理',
        keys: 'member',
        children: [
          {
            name: '用户列表',
            keys: ['/admin/adminMember/list'],
          },
          {
            name: '用户详细',
            keys: ['/admin/adminMember/detail'],
          },
        ],
      },
      {
        name: '信息管理',
        keys: 'post',
        children: [
          {name: '信息列表', keys: ['/admin/post/list', '/admin/post/list2']},
          {name: '信息详细', keys: ['/admin/post/detail', '/admin/post/detail2']},
        ],
      },
      {
        name: '角色管理',
        keys: 'role',
        children: [
          {
            name: '角色列表',
            keys: ['/admin/role/list', '/admin/role/list2'],
            children: [
              {name: '群主列表', keys: ['/admin/group/list', '/admin/group/list2']},
              {name: '群主详细', keys: ['/admin/group/detail', '/admin/group/detail2']},
            ],
          },
        ],
      },
    ]);
  }
}

export const api = new API();
