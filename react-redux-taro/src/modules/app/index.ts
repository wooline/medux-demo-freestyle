import {exportModule} from '@medux/react-taro-router';
import main from './views/Main';
import {ModuleHandlers} from './model';

export default exportModule('app', ModuleHandlers, {main});
