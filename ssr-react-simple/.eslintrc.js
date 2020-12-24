module.exports = {
  root: true,
  extends: ['plugin:@medux/recommended/common'],
  env: {
    browser: false,
    node: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
  },
  ignorePatterns: ['/src','/dist','/mock'],
};
