const apiProxy = {
  '/api': {
    target: 'http://192.168.0.232:8000',
    pathRewrite: {
      '^/api': '',
    },
    xfwd: true,
    secure: false,
    changeOrigin: true,
    timeout: 3000,
    proxyTimeout: 3000,
  },
};
const apiMaps = Object.keys(apiProxy).reduce((map, key) => {
  map[key] = apiProxy[key].target;
  return map;
}, {});
const base = {
  clientPublicPath: '/client/',
  apiMock: true,
  apiProxy,
  globalVar: {
    apiMaps: {},
  },
};

module.exports = {
  development: {
    ...base,
  },
  production: {
    ...base,
  },
};
