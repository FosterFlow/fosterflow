import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import WebSocket from './webSocket/reducers';
import User from './user/reducers';
import Agents from './agent/reducers';
import AiAgentProfile from './aiAgentProfile/reducers';
import UserAgentProfile from './userAgentProfile/reducers';
import Chat from './chat/reducers';
import Message from './message/reducers';
import Layout from './layout/reducer';

export default combineReducers({
    Auth,
    WebSocket,
    User,
    Agents,
    AiAgentProfile,
    UserAgentProfile,
    Chat,
    Message,
    Layout
});