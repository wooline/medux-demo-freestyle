export default {
  pages: ['pages/photos/index', 'pages/videos/index'],
  tabBar: {
    selectedColor: '#0089ff',
    list: [
      {
        text: '图片',
        pagePath: 'pages/photos/index',
      },
      {
        text: '视频',
        pagePath: 'pages/videos/index',
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
