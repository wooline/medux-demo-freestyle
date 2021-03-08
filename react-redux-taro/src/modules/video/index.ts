import {exportModule} from '@medux/react-taro-router';
import mainList from './views/MainList';
import {ModuleHandlers} from './model';

export default exportModule('video', ModuleHandlers, {mainList});
