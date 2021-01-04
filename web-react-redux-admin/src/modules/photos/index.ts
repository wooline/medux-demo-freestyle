import {exportModule} from '@medux/react-web-router';
import main from './views/Main';
import {ModuleHandlers} from './model';

export default exportModule('photos', ModuleHandlers, {main});
