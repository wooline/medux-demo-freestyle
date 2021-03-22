export default {
  pages: [
    'pages/photo/mainList/index',
    'pages/photo/mainItem/index',
    'pages/video/mainList/index',
    'pages/video/mainItem/index',
    'pages/comment/mainList/index',
    'pages/my/userSummary/index',
    'pages/app/login/index',
  ],
  tabBar: {
    selectedColor: '#0089ff',
    list: [
      {
        text: '图片',
        pagePath: 'pages/photo/mainList/index',
        iconPath: 'assets/imgs/menu-photo.png',
        selectedIconPath: 'assets/imgs/menu-photo2.png',
      },
      {
        text: '视频',
        pagePath: 'pages/video/mainList/index',
        iconPath: 'assets/imgs/menu-video.png',
        selectedIconPath: 'assets/imgs/menu-video2.png',
      },
      {
        text: '我的',
        pagePath: 'pages/my/userSummary/index',
        iconPath: 'assets/imgs/menu-my.png',
        selectedIconPath: 'assets/imgs/menu-my2.png',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
};
