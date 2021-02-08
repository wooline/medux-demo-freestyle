import {exportModule} from '@medux/react-web-router';
import {ModuleHandlers} from './model';

import loginForm from './views/LoginForm';
import registerForm from './views/RegisterForm';

export default exportModule('account', ModuleHandlers, {loginForm, registerForm});
