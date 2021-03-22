import {exportModule} from '@medux/react-taro-router';
import mainList from './views/MainList';
import mainItem from './views/MainItem';
import {ModuleHandlers} from './model';

export default exportModule('video', ModuleHandlers, {mainList, mainItem});
