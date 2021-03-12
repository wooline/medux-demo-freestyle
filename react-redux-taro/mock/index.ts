export = {
  '/api/getSession': import('./api/getSession'),
  '/api/login': import('./api/put-login'),
  '/api/logout': import('./api/put-logout'),
  '/api/getPhotoList': import('./api/getPhotoList'),
  '/api/getPhotoItem': import('./api/getPhotoItem'),
  '/api/getVideoList': import('./api/getVideoList'),
  '/api/getCommentList': import('./api/getCommentList'),
};
