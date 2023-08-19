import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import User from './user/reducers';
import Profile from './profile/reducers';
import Chat from './chat/reducers';
import Layout from './layout/reducer';

export default combineReducers({
    Auth,
    User,
    Profile,
    Chat,
    Layout
});