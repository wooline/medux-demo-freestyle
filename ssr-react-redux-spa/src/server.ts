import 'Global';
import {moduleGetter, locationTransform} from 'modules/config';
import {buildSSR} from '@medux/react-web-router';

export default function server(request: any, response: any) {
  return buildSSR(moduleGetter, {request, response, locationTransform});
}
