import {exportModule} from '@medux/react-taro-router';
import userSummary from './views/UserSummary';
import {ModuleHandlers} from './model';

export default exportModule('my', ModuleHandlers, {userSummary});
