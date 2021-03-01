import Taro from '@tarojs/taro';
import {ApiMaps} from '~/Global';

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
  return Taro.request(options);
};
export default request;
