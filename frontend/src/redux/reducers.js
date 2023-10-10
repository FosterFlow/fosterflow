import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import WebSocket from './webSocket/reducers';
import User from './user/reducers';
import Agents from './agents/reducers';
import Chat from './chat/reducers';
import Layout from './layout/reducer';

export default combineReducers({
    Auth,
    WebSocket,
    User,
    Agents,
    Chat,
    Layout
});