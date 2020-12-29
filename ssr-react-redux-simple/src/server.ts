import 'Global';
import {moduleGetter, locationTransform} from 'modules/config';
import {buildSSR, ServerRequest, ServerResponse} from '@medux/react-web-router';

export default function server(request: ServerRequest, response: ServerResponse) {
  return buildSSR(moduleGetter, {request, response, locationTransform});
}
