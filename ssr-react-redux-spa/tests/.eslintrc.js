module.exports = {
  root: true,
  extends: ['plugin:@medux/recommended/react'],
  env: {
    browser: false,
    node: false,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
  },
  ignorePatterns: [],
};
