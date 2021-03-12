import Taro from '@tarojs/taro';
import {ApiMaps} from '@/src/Global';
import {CommonErrorCode, QuietError, CustomError} from '@/src/common/errors';

const request: typeof Taro.request = (args) => {
  const options: typeof args = {...args};
  if (!options.header) {
    options.header = {};
  }
  // options.header.Authorization = localStorage.getItem(metaKeys.AccountTokenStorageKey) || '';
  Object.keys(ApiMaps).some((key) => {
    if (options.url?.startsWith(key)) {
      options.url = options.url.replace(key, ApiMaps[key]);
      return true;
    }
    return false;
  });
  return Taro.request(options)
    .then((res) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        return res;
      }
      throw res;
    })
    .catch((res: {data?: {}; json: () => Promise<any>}) => {
      if (res.json) {
        return res.json().then(
          (detail) => {
            throw detail;
          },
          () => {
            throw new CustomError(CommonErrorCode.unknown, '请求服务器失败');
          }
        );
      }
      if (res.data) {
        throw res.data;
      } else {
        throw new CustomError(CommonErrorCode.unknown, '请求服务器失败');
      }
    }) as any;
};
export default request;
