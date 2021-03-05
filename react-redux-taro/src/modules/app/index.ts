import {exportModule} from '@medux/react-taro-router';
import login from './views/Login';
import {ModuleHandlers} from './model';

export default exportModule('app', ModuleHandlers, {login});
