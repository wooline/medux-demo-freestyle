import axios, {AxiosError, AxiosResponse} from 'axios';
import {isServer} from '@medux/react-web-router';
import {metaKeys} from 'common/meta';
import {CustomError} from './errors';

const instance = axios.create();

instance.interceptors.request.use((req) => {
  if (!req.headers) {
    req.headers = {};
  }
  if (!isServer()) {
    req.headers.Authorization = localStorage.getItem(metaKeys.AccountTokenStorageKey) || '';
  }
  Object.keys(ENV.apiMaps).some((key) => {
    if (req.url?.startsWith(key)) {
      req.url = req.url.replace(key, ENV.apiMaps[key]);
      return true;
    }
    return false;
  });
  return req;
});

instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error: AxiosError<{message: string}>) => {
    const httpErrorCode = error.response ? error.response.status : 0;
    const statusText = error.response ? error.response.statusText : error.message;
    const responseData: any = error.response ? error.response.data : error.message;
    const errorMessage = responseData.message || `${statusText}, failed to call ${error.config?.url}`;
    throw new CustomError(httpErrorCode.toString(), errorMessage, responseData);
  }
);

export default instance;
