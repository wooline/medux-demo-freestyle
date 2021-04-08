module.exports = {
  presets: [
    ['@medux/recommended', {presets: ['@babel/preset-react'], plugins: [['import', {libraryName: 'antd', libraryDirectory: 'es', style: true}]]}],
  ],
  ignore: ['**/*.d.ts'],
  comments: false,
};
