// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        targets: {
          ios: '10',
          android: '6',
        },
        framework: 'react',
        ts: true,
        loose: true,
        decoratorsBeforeExport: true,
        decoratorsLegacy: false,
      },
    ],
  ],
};
