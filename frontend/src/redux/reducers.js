import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Auth from './webSocket/reducers';
import User from './user/reducers';
import Agent from './agent/reducers';
import Chat from './chat/reducers';
import Layout from './layout/reducer';

export default combineReducers({
    Auth,
    User,
    Agent,
    Chat,
    Layout
});