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
    'no-console': 'off'
  },
  ignorePatterns: ['/src','/dist','/mock', '/public/client/polyfill.js'],
};
