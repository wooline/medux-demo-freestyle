import {exportModule} from '@medux/react-taro-router';
import commonPage from './views/CommonPage';
import login from './views/Login';
import {ModuleHandlers} from './model';

export default exportModule('app', ModuleHandlers, {commonPage, login});
